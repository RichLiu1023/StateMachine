/// <reference path="StateEventUnit.ts" />
/// <reference path="IState.ts" />
/// <reference path="IStateEvent.ts" />


module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-29
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 状态机数据
	 */
	export class StateMachineData {
		private _stateEventUnit: sm.StateEventUnit[] = [];
		private _states: any = {};
		private _events: any = {};
		public bindData: any;
		private _stateMachine: sm.StateMachine;

		public constructor(stateMachine: sm.StateMachine) {
			this._stateMachine = stateMachine;
		}

		public pushUnit( unit:sm.StateEventUnit ):void {
			var result = this.findStateEventUnitByToName( unit.event, unit.to );
			!result && this._stateEventUnit.push( unit );
		}

		public pushState(state: sm.IState): void {
			var result = this.findStateByName(state.stateName);
			if (!result) {
				state.stateMachine = this._stateMachine;
				this._states[state.stateName] = state;
			}
		}

		public pushEvent(event: sm.IStateEvent): void {
			var result = this.findEventByName(event.eventName);
			if (!result) {
				event.stateMachine = this._stateMachine;
				this._events[event.eventName] = event;
			}
		}

		/**
		 * 查找 相同同事件、相同转向状态 的 Unit
		 * 转向状态是 多对一 ，一个事件可以有多个状态转向到一个状态
		 * @param eventName 事件Unit名
		 * @param toName 转向状态名
		 * @returns {sm.StateEventUnit}
		 */
		public findStateEventUnitByToName( eventName:string, toName:string ):sm.StateEventUnit {
			var len = this._stateEventUnit.length;
			for ( var idx = 0; idx < len; idx++ ) {
				var unit = this._stateEventUnit[ idx ];
				if ( unit.event == eventName && unit.to == toName ) {
					return unit;
				}
			}
			return null;
		}

		/**
		 * 查找 相同同事件、相同起始状态 的 Unit
		 * 转向状态是 多对一 ，一个事件可以有多个状态转向到一个状态
		 * @param eventName 事件Unit名
		 * @param fromName 起始状态名
		 * @returns {sm.StateEventUnit}
		 */
		public findStateEventUnitByFromName( eventName:string, fromName:string ):sm.StateEventUnit {
			var len = this._stateEventUnit.length;
			for ( var idx = 0; idx < len; idx++ ) {
				var unit = this._stateEventUnit[ idx ];
				if ( unit.event == eventName &&
					(this.isNoneEvent( unit, fromName )
					|| unit.findFromByName( fromName )) ) {
					return unit;
				}
			}
			return null;
		}

		/**
		 * 是否是None状态，如果true 则 可以转向任何状态
		 * @param uint
		 * @param fromName
		 * @returns {boolean}
		 */
		public isNoneEvent( uint:sm.StateEventUnit, fromName:string ):boolean {
			if ( fromName == 'none' )return true;
			return uint.findFromByName( 'none' );
		}

		/**
		 * 查找状态
		 * @param stateName 状态名
		 * @returns {sm.IState}
		 */
		public findStateByName( stateName:string ):sm.IState {
			var state = this._states[ stateName ];
			return state || null;
		}

		/**
		 * 查找事件
		 * @param eventName 事件名
		 * @returns {sm.IStateEvent}
		 */
		public findEventByName( eventName:string ):sm.IStateEvent {
			var event = this._events[ eventName ];
			return event || null;
		}
	}
}