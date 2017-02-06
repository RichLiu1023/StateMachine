# StateMachine
状态机

```
let gsm = sm.StateMachine.create();
//注册状态
gsm.registerStates({
    stateName: 'resulting',
    onEnter: function () {
        console.log('=====>enter resulting......');
    }
});
gsm.registerStates(new ShowingState());
gsm.registerStates([new RollingState(), new WaittingState()]);
//注册事件
gsm.registerEvents(new RollEvent());
//注册转换
gsm.register('roll', 'waiting', 'rolling');
gsm.register('show', 'rolling', 'showing');
gsm.register('result', 'showing', 'resulting');
gsm.register('wait', ['resulting', 'forceStopping'], 'waiting');
gsm.register('force', 'none', 'forceStopping');
gsm.initial = 'none';

console.log('current state:', gsm.current);
gsm.emit(wait);
``` 