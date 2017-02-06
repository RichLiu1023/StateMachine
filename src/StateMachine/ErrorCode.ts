module sm {
	/**
	 * Create by richliu1023
	 * @date 2016-08-15
	 * @email richliu1023@gmail.com
	 * @github https://github.com/RichLiu1023
	 * @description 错误码
	 */
	export class ErrorCode {
		public static e1:string = '重复添加状态';
		public static e2:string = '重复添加事件';
		public static e3:string = '不可执行事件';
		public static e4:string = '转向状态to不可以为none';
		public static e5:string = '注册状态或事件不能为null';
		public static e6:string = '注册状态必须有stateName或事件必须有eventName属性';
		public static e7:string = '必须是函数';
		public static e8:string = '当前已阻塞，等待调用transition或cancelTransition';
	}
}