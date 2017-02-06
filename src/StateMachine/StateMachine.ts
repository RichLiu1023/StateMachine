/// <reference path="ErrorCode.ts" />
/// <reference path="StateMachineData.ts" />

module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-29
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 状态机
	 * 状态名'none'可以转向任何状态。
	 * 如果不指定initial的值，则默认为'none'
	 */
	export class StateMachine {

		public DEFAULT: string = 'none';
		public ASYNC: string = 'async';
		/**
		 * 状态机初始状态，默认为'none'
		 * 也可以指定初始状态，但不会执行指定状态的 onEnter
		 * @type {string}
		 */
		public initial: string = this.DEFAULT;
		private _current: string;
		private _data: sm.StateMachineData;
		private transitionUnit: sm.StateEventUnit;

		public constructor() {
			this._data = new sm.StateMachineData();
		}

		public static create(): sm.StateMachine {
			return new sm.StateMachine();
		}

		/**
		 * 当前状态名
		 * @returns {string}
		 */
		get current(): string {
			return this._current || this.initial;
		}

		/**
		 * 注册状态机
		 * 如果要接收和处理状态变迁、事件触发可以先注册 registerStates、registerEvents
		 * 转向状态to 不可以为‘none’
		 * @param event 事件名
		 * @param from 起始状态名列表或一个状态名
		 * @param to 转向状态名
		 */
		public register(event: string, from: Array<string> | string, to: string): void {
			if (to == this.DEFAULT) {
				throw sm.ErrorCode.e4;
			}
			var unit = this._data.findStateEventUnitByToName(event, to);
			if (!unit) {
				unit = sm.StateEventUnit.register(event, from, to);
				this._data.pushUnit(unit);
			}
			else {
				unit.addFrom(from);
			}
		}

		/**
		 * 
		 * 注册状态
		 * @param {(Array<sm.IState> | sm.IState)} states 状态列表或一个状态
		 * @returns {sm.StateMachine}
		 * 
		 * @memberOf StateMachine
		 */
		public registerStates(states: Array<sm.IState> | sm.IState): sm.StateMachine {
			if (!states) return;
			if (states instanceof Array) {
				var len = states.length;
				for (var idx = 0; idx < len; idx++) {
					this.registerState(states[idx]);
				}
			}
			else {
				this.registerState(states);
			}
			return this;
		}

		private registerState(state: sm.IState): void {
			if (!state) {
				throw sm.ErrorCode.e5;
			}
			if (!state['stateName']) {
				throw sm.ErrorCode.e6;
			}
			if (state['onEnter'] && !(typeof state.onEnter == 'function')) {
				throw 'onAfter' + sm.ErrorCode.e7;
			}
			if (state['onLeave'] && !(typeof state.onLeave == 'function')) {
				throw 'onLeave' + sm.ErrorCode.e7;
			}
			if (state['onInterrupt'] && !(typeof state.onInterrupt == 'function')) {
				throw 'onInterrupt' + sm.ErrorCode.e7;
			}
			var result = this._data.findStateByName(state.stateName);
			if (result) {
				throw sm.ErrorCode.e1 + state.stateName;
			}
			else {
				this._data.pushState(state);
			}
		}

		/**
		 * 注册事件
		 * @param events 事件列表或一个事件
		 * @returns {sm.StateMachine}
		 */
		public registerEvents(events: Array<sm.IStateEvent> | sm.IStateEvent): sm.StateMachine {
			if (!events) return;
			if (events instanceof Array) {
				var len = events.length;
				for (var idx = 0; idx < len; idx++) {
					this.registerEvent(events[idx]);
				}
			}
			else {
				this.registerEvent(events);
			}
			return this;
		}

		private registerEvent(event: sm.IStateEvent): sm.StateMachine {
			if (!event) {
				throw sm.ErrorCode.e5;
			}
			if (!event['eventName']) {
				throw sm.ErrorCode.e6;
			}
			if (event['onAfter'] && !(typeof event.onAfter == 'function')) {
				throw 'onAfter' + sm.ErrorCode.e7;
			}
			if (event['onBefore'] && !(typeof event.onBefore == 'function')) {
				throw 'onBefore' + sm.ErrorCode.e7;
			}
			var result = this._data.findEventByName(event.eventName);
			if (result) {
				throw sm.ErrorCode.e2 + event.eventName;
			}
			else {
				this._data.pushEvent(event);
			}
			return this;
		}

		/**
		 * 执行事件，开始状态转换
		 * 执行顺序为
		 * event.onBefore
		 * from.onLeave 如果返回‘async’则会阻塞当前状态直到调用transition或cancelTransition
		 * to.onEnter
		 * event.onAfter
		 * @param eventName 事件名
		 */
		public emit(eventName: string): void {
			if (this.transitionUnit) {
				console.log(this.current, sm.ErrorCode.e8, sm.ErrorCode.e3, eventName);
				return;
			}
			var unit = this._data.findStateEventUnitByFromName(eventName, this.current);
			unit && this.execute(unit);
			!unit && console.log(sm.ErrorCode.e3, eventName);
		}

		/**
		 * 在当前状态，是否可以执行此事件
		 * @param eventName
		 * @returns {boolean}
		 */
		public can(eventName: string): boolean {
			if (this.transitionUnit) return false;
			var unit = this._data.findStateEventUnitByFromName(eventName, this.current);
			return !!unit;
		}

		/**
		 * 是否为当前状态
		 * @param stateName 状态名
		 * @returns {boolean}
		 */
		public is(stateName: string): boolean {
			return stateName == this.current;
		}

		/**
		 * 异步转换
		 * from.onInterrupt
		 * to.onEnter
		 * event.onAfter
		 */
		public transition(): void {
			if (this.transitionUnit) {
				this.interrupter(this.current);
				this.enter(this.transitionUnit.to);
				this.after(this.transitionUnit.event);
				this._current = this.transitionUnit.to;
			}
			this.transitionUnit = null;
		}

		/**
		 * 取消异步转换
		 * onInterrupt
		 * event.onAfter
		 */
		public cancelTransition(): void {
			if (this.transitionUnit) {
				this.interrupter(this.current);
				this.after(this.transitionUnit.event);
			}
			this.transitionUnit = null;
		}

		/**
		 * 当前是否处于 async
		 * @returns {boolean}
		 */
		public isTransition(): boolean {
			return !!this.transitionUnit;
		}

		/**
		 * 强制中断当前状态，并跳转到 none 状态
		 * 1、当前处于 async 状态时会调用 cancelTransition
		 * 2、不会调用当前状态的 onLeave
		 */
		public interrupt(): void {
			this.cancelTransition();
			this._current = this.DEFAULT;
		}

		/**
		 * 执行事件，开始状态转换
		 * 执行顺序为
		 * event.onBefore
		 * from.onLeave
		 * to.onEnter
		 * event.onAfter
		 */
		private execute(unit: sm.StateEventUnit): void {
			var preState = this._data.findStateByName(this.current);
			this.before(unit.event);
			var result: any = true;
			if (preState && preState.onLeave) {
				result = preState.onLeave();
			}
			if (result == this.ASYNC) {
				this.transitionUnit = unit;
			}
			else {
				this.enter(unit.to);
				this.after(unit.event);
				this._current = unit.to;
			}
		}

		private interrupter(stateName: string): void {
			var state = this._data.findStateByName(stateName);
			state && state.onInterrupt && state.onInterrupt();
		}

		private enter(stateName: string): void {
			var state = this._data.findStateByName(stateName);
			state && state.onEnter && state.onEnter();
		}

		private after(eventName: string): void {
			var event = this._data.findEventByName(eventName);
			event && event.onAfter && event.onAfter();
		}

		private before(eventName: string): void {
			var event = this._data.findEventByName(eventName);
			event && event.onBefore && event.onBefore();
		}
	}
}