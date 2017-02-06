/// <reference path="../bin/sm/sm.d.ts" />

let gsm = sm.StateMachine.create();

class RollingState implements sm.IState {
    stateName: string = 'rolling';
    onEnter(): void {
        console.log('=====>enter rolling......');
    }
    onLeave(): any {
        console.log('=====>leave rolling......');
    }
    onInterrupt(): void {
    }
}
class ShowingState implements sm.IState {
    stateName: string = 'showing';
    step1:number;
    step2:number;
    onEnter(): void {
        console.log('=====>enter showing......');
    }
    onLeave(): any {
        console.log('=====>sync leave showing......0');
        this.step1 = setTimeout(function () {
            console.log('=====>sync leave showing......1');
        }, 1000);
        this.step2 = setTimeout(function () {
            console.log('=====>sync leave showing......2');
            gsm.transition();
        }, 3000);
        return 'async';
    }
    onInterrupt(): void {
        clearTimeout(this.step1);
        clearTimeout(this.step2);
        console.log('=====>interrupt showing......');
    }
}
class WaittingState implements sm.IState {
    stateName: string = 'waiting';
    onEnter(): void {
        console.log('=====>enter waitting......');
    }
    onLeave(): any {
        console.log('=====>leave waitting......');
    }
    onInterrupt(): void {
    }
}
class RollEvent implements sm.IStateEvent {
    eventName: string = 'roll';
    onBefore(): void {
        console.log('=====>before roll event');
    }
    onAfter(): void {
        console.log('=====>after roll event');
    }
}

function on(event): void {
    console.log('**********************************');
    console.log('on event:', event);
    gsm.emit(event);
    console.log('current state:', gsm.current);
}
function interrupt(): void {
    console.log('**********************************');
    console.log('interrupt state');
    gsm.interrupt();
    console.log('current state:', gsm.current);
}

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

this.on('wait');
this.on('roll');
this.on('result');
this.on('show');
this.on('result');
this.on('wait');
this.interrupt();
this.on('wait');