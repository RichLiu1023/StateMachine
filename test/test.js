/// <reference path="../bin/sm/sm.d.ts" />
var gsm = sm.StateMachine.create();
var RollingState = (function () {
    function RollingState() {
        this.stateName = 'rolling';
    }
    RollingState.prototype.onEnter = function () {
        console.log('=====>enter rolling......');
    };
    RollingState.prototype.onLeave = function () {
        console.log('=====>leave rolling......');
    };
    RollingState.prototype.onInterrupt = function () {
    };
    return RollingState;
})();
var ShowingState = (function () {
    function ShowingState() {
        this.stateName = 'showing';
    }
    ShowingState.prototype.onEnter = function () {
        console.log('=====>enter showing......');
    };
    ShowingState.prototype.onLeave = function () {
        console.log('=====>sync leave showing......0');
        this.step1 = setTimeout(function () {
            console.log('=====>sync leave showing......1');
        }, 1000);
        this.step2 = setTimeout(function () {
            console.log('=====>sync leave showing......2');
            gsm.transition();
        }, 3000);
        return 'async';
    };
    ShowingState.prototype.onInterrupt = function () {
        clearTimeout(this.step1);
        clearTimeout(this.step2);
        console.log('=====>interrupt showing......');
    };
    return ShowingState;
})();
var WaittingState = (function () {
    function WaittingState() {
        this.stateName = 'waiting';
    }
    WaittingState.prototype.onEnter = function () {
        console.log('=====>enter waitting......');
    };
    WaittingState.prototype.onLeave = function () {
        console.log('=====>leave waitting......');
    };
    WaittingState.prototype.onInterrupt = function () {
    };
    return WaittingState;
})();
var RollEvent = (function () {
    function RollEvent() {
        this.eventName = 'roll';
    }
    RollEvent.prototype.onBefore = function () {
        console.log('=====>before roll event');
    };
    RollEvent.prototype.onAfter = function () {
        console.log('=====>after roll event');
    };
    return RollEvent;
})();
function on(event) {
    console.log('**********************************');
    console.log('on event:', event);
    gsm.emit(event);
    console.log('current state:', gsm.current);
}
function interrupt() {
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
