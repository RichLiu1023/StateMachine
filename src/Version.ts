module sm {
	/**
	 * v1.1.1 20170609
	 * 增加状态转换时，不可以继续转换
	 * v1.1.0 20170602
	 * 增加 emit 时传递 临时数据
	 * 增加 StateMachine 绑定数据
	 * 修改 interrupt 打断时触发当前状态的 onInterrupt
	 * v1.0.3 20161010
	 * @type {string}
	 */
	export const version: string = '1.1.1';
}
