import { useStore } from './useStore';
/* eslint-disable no-cond-assign */
export class Store {
    state;
    // HACK: `any` fixes adding listeners that accept partial state.
    listeners;
    // Internal state to handle recursive `setState()` calls
    updateTick;
    static create(state) {
        return new Store(state);
    }
    constructor(state) {
        this.state = state;
        this.listeners = new Set();
        this.updateTick = 0;
    }
    subscribe = (fn) => {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    };
    /**
     * Returns the current state snapshot. Meant for usage with `useSyncExternalStore`.
     * If you want to access the state, use the `state` property instead.
     */
    getSnapshot = () => {
        return this.state;
    };
    setState(newState) {
        this.state = newState;
        this.updateTick += 1;
        const currentTick = this.updateTick;
        const it = this.listeners.values();
        let result;
        while (((result = it.next()), !result.done)) {
            if (currentTick !== this.updateTick) {
                // If the tick has changed, a recursive `setState` call has been made,
                // and it has already notified all listeners.
                return;
            }
            const listener = result.value;
            listener(newState);
        }
    }
    update(changes) {
        for (const key in changes) {
            if (!Object.is(this.state[key], changes[key])) {
                this.setState({ ...this.state, ...changes });
                return;
            }
        }
    }
    set(key, value) {
        if (!Object.is(this.state[key], value)) {
            this.setState({ ...this.state, [key]: value });
        }
    }
    use = ((selector, a1, a2, a3) => {
        return useStore(this, selector, a1, a2, a3);
    });
}
