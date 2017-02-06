declare module sm {
    const version: string;
}
declare module sm {
    class ErrorCode {
        static e1: string;
        static e2: string;
        static e3: string;
        static e4: string;
        static e5: string;
        static e6: string;
        static e7: string;
        static e8: string;
    }
}
declare module sm {
    interface IState {
        stateName: string;
        onEnter?: () => void;
        onLeave?: () => void | string;
        onInterrupt?: () => void;
    }
}
declare module sm {
    interface IStateEvent {
        eventName: string;
        onBefore(): void;
        onAfter(): void;
    }
}
declare module sm {
    class StateEventUnit {
        event: string;
        froms: string[];
        to: string;
        constructor();
        static register(event: string, from: Array<string> | string, to: string): sm.StateEventUnit;
        private addFroms(froms);
        addFrom(from: Array<string> | string): void;
        findFromByName(fromName: string): boolean;
        private register(event, from, to);
    }
}
declare module sm {
    class StateMachineData {
        private _stateEventUnit;
        private _states;
        private _events;
        constructor();
        pushUnit(unit: sm.StateEventUnit): void;
        pushState(state: sm.IState): void;
        pushEvent(event: sm.IStateEvent): void;
        findStateEventUnitByToName(eventName: string, toName: string): sm.StateEventUnit;
        findStateEventUnitByFromName(eventName: string, fromName: string): sm.StateEventUnit;
        isNoneEvent(uint: sm.StateEventUnit, fromName: string): boolean;
        findStateByName(stateName: string): sm.IState;
        findEventByName(eventName: string): sm.IStateEvent;
    }
}
declare module sm {
    class StateMachine {
        DEFAULT: string;
        ASYNC: string;
        initial: string;
        private _current;
        private _data;
        private transitionUnit;
        constructor();
        static create(): sm.StateMachine;
        current: string;
        register(event: string, from: Array<string> | string, to: string): void;
        registerStates(states: Array<sm.IState> | sm.IState): sm.StateMachine;
        private registerState(state);
        registerEvents(events: Array<sm.IStateEvent> | sm.IStateEvent): sm.StateMachine;
        private registerEvent(event);
        emit(eventName: string): void;
        can(eventName: string): boolean;
        is(stateName: string): boolean;
        transition(): void;
        cancelTransition(): void;
        isTransition(): boolean;
        interrupt(): void;
        private execute(unit);
        private interrupter(stateName);
        private enter(stateName);
        private after(eventName);
        private before(eventName);
    }
}
