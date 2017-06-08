var sm;
(function (sm) {
    sm.version = '1.1.0';
})(sm || (sm = {}));
var sm;
(function (sm) {
    var ErrorCode = (function () {
        function ErrorCode() {
        }
        ErrorCode.e1 = '重复添加状态';
        ErrorCode.e2 = '重复添加事件';
        ErrorCode.e3 = '不可执行事件';
        ErrorCode.e4 = '转向状态to不可以为none';
        ErrorCode.e5 = '注册状态或事件不能为null';
        ErrorCode.e6 = '注册状态必须有stateName或事件必须有eventName属性';
        ErrorCode.e7 = '必须是函数';
        ErrorCode.e8 = '当前已阻塞，等待调用transition或cancelTransition';
        return ErrorCode;
    }());
    sm.ErrorCode = ErrorCode;
})(sm || (sm = {}));
var sm;
(function (sm) {
    var StateEventUnit = (function () {
        function StateEventUnit() {
            this.froms = [];
        }
        StateEventUnit.register = function (event, from, to) {
            var unit = new sm.StateEventUnit();
            unit.register(event, from, to);
            return unit;
        };
        StateEventUnit.prototype.addFroms = function (froms) {
            if (!froms || froms.length == 0)
                return;
            froms.forEach(function (item) {
                this.addFrom(item);
            }, this);
        };
        StateEventUnit.prototype.addFrom = function (from) {
            if (!from)
                return;
            if (from instanceof Array) {
                this.addFroms(from);
            }
            else {
                !this.findFromByName(from) && this.froms.push(from);
            }
        };
        StateEventUnit.prototype.findFromByName = function (fromName) {
            var idx = this.froms.indexOf(fromName);
            return !!~idx;
        };
        StateEventUnit.prototype.register = function (event, from, to) {
            this.event = event;
            this.addFrom(from);
            this.to = to;
        };
        return StateEventUnit;
    }());
    sm.StateEventUnit = StateEventUnit;
})(sm || (sm = {}));
var sm;
(function (sm) {
    var StateMachineData = (function () {
        function StateMachineData(stateMachine) {
            this._stateEventUnit = [];
            this._states = {};
            this._events = {};
            this._stateMachine = stateMachine;
        }
        StateMachineData.prototype.pushUnit = function (unit) {
            var result = this.findStateEventUnitByToName(unit.event, unit.to);
            !result && this._stateEventUnit.push(unit);
        };
        StateMachineData.prototype.pushState = function (state) {
            var result = this.findStateByName(state.stateName);
            if (!result) {
                state.stateMachine = this._stateMachine;
                this._states[state.stateName] = state;
            }
        };
        StateMachineData.prototype.pushEvent = function (event) {
            var result = this.findEventByName(event.eventName);
            if (!result) {
                event.stateMachine = this._stateMachine;
                this._events[event.eventName] = event;
            }
        };
        StateMachineData.prototype.findStateEventUnitByToName = function (eventName, toName) {
            var len = this._stateEventUnit.length;
            for (var idx = 0; idx < len; idx++) {
                var unit = this._stateEventUnit[idx];
                if (unit.event == eventName && unit.to == toName) {
                    return unit;
                }
            }
            return null;
        };
        StateMachineData.prototype.findStateEventUnitByFromName = function (eventName, fromName) {
            var len = this._stateEventUnit.length;
            for (var idx = 0; idx < len; idx++) {
                var unit = this._stateEventUnit[idx];
                if (unit.event == eventName &&
                    (this.isNoneEvent(unit, fromName)
                        || unit.findFromByName(fromName))) {
                    return unit;
                }
            }
            return null;
        };
        StateMachineData.prototype.isNoneEvent = function (uint, fromName) {
            if (fromName == 'none')
                return true;
            return uint.findFromByName('none');
        };
        StateMachineData.prototype.findStateByName = function (stateName) {
            var state = this._states[stateName];
            return state || null;
        };
        StateMachineData.prototype.findEventByName = function (eventName) {
            var event = this._events[eventName];
            return event || null;
        };
        return StateMachineData;
    }());
    sm.StateMachineData = StateMachineData;
})(sm || (sm = {}));
var sm;
(function (sm) {
    var StateMachine = (function () {
        function StateMachine() {
            this.DEFAULT = 'none';
            this.ASYNC = 'async';
            this.initial = this.DEFAULT;
            this._data = new sm.StateMachineData(this);
        }
        StateMachine.create = function () {
            return new sm.StateMachine();
        };
        StateMachine.prototype.setBindData = function (data) {
            this._data.bindData = data;
            return this;
        };
        Object.defineProperty(StateMachine.prototype, "bindData", {
            get: function () {
                return this._data.bindData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StateMachine.prototype, "current", {
            get: function () {
                return this._current || this.initial;
            },
            enumerable: true,
            configurable: true
        });
        StateMachine.prototype.register = function (event, from, to) {
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
        };
        StateMachine.prototype.registerStates = function (states) {
            if (!states)
                return;
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
        };
        StateMachine.prototype.registerState = function (state) {
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
        };
        StateMachine.prototype.registerEvents = function (events) {
            if (!events)
                return;
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
        };
        StateMachine.prototype.registerEvent = function (event) {
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
        };
        StateMachine.prototype.emit = function (eventName, data) {
            if (this.transitionUnit) {
                console.log(this.current, sm.ErrorCode.e8, sm.ErrorCode.e3, eventName);
                return;
            }
            var unit = this._data.findStateEventUnitByFromName(eventName, this.current);
            if (unit) {
                unit.data = data;
                this.execute(unit);
            }
            !unit && console.log(sm.ErrorCode.e3, eventName);
        };
        StateMachine.prototype.can = function (eventName) {
            if (this.transitionUnit)
                return false;
            var unit = this._data.findStateEventUnitByFromName(eventName, this.current);
            return !!unit;
        };
        StateMachine.prototype.is = function (stateName) {
            return stateName == this.current;
        };
        StateMachine.prototype.transition = function () {
            if (this.transitionUnit) {
                this.interrupter(this.current);
                this.enter(this.transitionUnit.to, this.transitionUnit.data);
                this.after(this.transitionUnit.event, this.transitionUnit.data);
                this.transitionUnit.data = null;
                this._current = this.transitionUnit.to;
            }
            this.transitionUnit = null;
        };
        StateMachine.prototype.cancelTransition = function () {
            if (this.transitionUnit) {
                this.interrupter(this.current);
                this.after(this.transitionUnit.event, this.transitionUnit.data);
                this.transitionUnit.data = null;
            }
            this.transitionUnit = null;
        };
        StateMachine.prototype.isTransition = function () {
            return !!this.transitionUnit;
        };
        StateMachine.prototype.interrupt = function () {
            if (this.isTransition())
                this.cancelTransition();
            else
                this.interrupter(this.current);
            this._current = this.DEFAULT;
        };
        StateMachine.prototype.execute = function (unit) {
            var preState = this._data.findStateByName(this.current);
            this.before(unit.event, unit.data);
            var result = true;
            if (preState && preState.onLeave) {
                result = preState.onLeave(unit.data);
            }
            if (result == this.ASYNC) {
                this.transitionUnit = unit;
            }
            else {
                this.enter(unit.to, unit.data);
                this.after(unit.event, unit.data);
                unit.data = null;
                this._current = unit.to;
            }
        };
        StateMachine.prototype.interrupter = function (stateName) {
            var state = this._data.findStateByName(stateName);
            state && state.onInterrupt && state.onInterrupt();
        };
        StateMachine.prototype.enter = function (stateName, data) {
            var state = this._data.findStateByName(stateName);
            state && state.onEnter && state.onEnter(data);
        };
        StateMachine.prototype.after = function (eventName, data) {
            var event = this._data.findEventByName(eventName);
            event && event.onAfter && event.onAfter(data);
        };
        StateMachine.prototype.before = function (eventName, data) {
            var event = this._data.findEventByName(eventName);
            event && event.onBefore && event.onBefore(data);
        };
        return StateMachine;
    }());
    sm.StateMachine = StateMachine;
})(sm || (sm = {}));
