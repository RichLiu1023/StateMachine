module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-29
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 事件接口
	 */
	export interface IStateEvent {
		eventName:string;
		onBefore():void;
		onAfter():void;
	}
}