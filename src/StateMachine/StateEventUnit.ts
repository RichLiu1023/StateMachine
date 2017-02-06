module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-29
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 一个状态转换单元
	 */
	export class StateEventUnit {

		public event: string;
		public froms: string[] = [];
		public to: string;

		public constructor() {
		}

		/**
		 * 注册事件及状态转换
		 * @param event 事件，具有唯一性
		 * @param from 状态，可以为状态数组或一个状态
		 * @param to 状态
		 */
		public static register(event: string, from: Array<string> | string, to: string): sm.StateEventUnit {
			var unit = new sm.StateEventUnit();
			unit.register(event, from, to);
			return unit;
		}

		private addFroms(froms: Array<string>): void {
			if (!froms || froms.length == 0) return;
			froms.forEach(function (item) {
				this.addFrom(item);
			}, this);
		}

		/**
		 * 添加状态转换
		 * @param from 状态，可以为状态数组或一个状态
		 */
		public addFrom(from: Array<string> | string): void {
			if (!from) return;
			if (from instanceof Array) {
				this.addFroms(from);
			}
			else {
				!this.findFromByName(from) && this.froms.push(from);
			}
		}

		/**
		 * 查找起始状态
		 * @param fromName 状态名
		 * @returns {string}
		 */
		public findFromByName(fromName: string): boolean {
			var idx = this.froms.indexOf(fromName);
			return !!~idx;
		}

		/**
		 * 注册事件及状态转换
		 * @param event 事件，具有唯一性
		 * @param from 状态，可以为状态数组或一个状态
		 * @param to 状态
		 */
		private register(event: string, from: Array<string> | string, to: string): void {
			this.event = event;
			this.addFrom(from);
			this.to = to;
		}
	}
}