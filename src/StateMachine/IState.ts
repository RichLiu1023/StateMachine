module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-29
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 状态接口
	 */
	export interface IState {
		stateName: string;
		onEnter?: () => void;
		/**
		 * 如果返回‘async’则会阻塞当前事件直到调用transition或cancelTransition
		 */
		onLeave?: () => void | string;
		/**
		 * 打断async状态时触发
		 * transition或cancelTransition都会触发
		 */
		onInterrupt?: () => void;
	}
}