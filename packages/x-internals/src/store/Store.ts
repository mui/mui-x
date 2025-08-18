type Listener<T> = (value: T) => void;

/* eslint-disable no-cond-assign */

export class Store<State> {
  public state: State;

  // HACK: `any` fixes adding listeners that accept partial state.
  private listeners: Set<Listener<any>>;

  // Internal state to handle recursive `setState()` calls
  private updateTick: number;

  static create<T>(state: T) {
    return new Store(state);
  }

  constructor(state: State) {
    this.state = state;
    this.listeners = new Set();
    this.updateTick = 0;
  }

  subscribe = (fn: Listener<State>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => {
    return this.state;
  };

  setState(newState: State) {
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

  update(changes: Partial<State>) {
    for (const key in changes) {
      if (!Object.is(this.state[key], changes[key])) {
        this.setState({ ...this.state, ...changes });
        return;
      }
    }
  }

  set<T>(key: keyof State, value: T) {
    if (!Object.is(this.state[key], value)) {
      this.setState({ ...this.state, [key]: value });
    }
  }
}
