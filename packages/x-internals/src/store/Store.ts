type Listener<T> = (value: T) => void;

/* eslint-disable no-cond-assign */
/* eslint-disable lines-between-class-members */

export class Store<State> {
  public state: State;

  // HACK: `any` fixes adding listeners that accept partial state.
  private listeners: Set<Listener<any>>;

  // Internal state to handle recursive `setState()` calls
  private isUpdating: boolean;
  private needsReset: boolean;

  static create<T>(state: T) {
    return new Store(state);
  }

  constructor(state: State) {
    this.state = state;
    this.listeners = new Set();
    this.isUpdating = false;
    this.needsReset = false;
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
    if (this.isUpdating) {
      this.needsReset = true;
      return;
    }
    let it = this.listeners.values();
    let result;
    while (((result = it.next()), !result.done)) {
      if (this.needsReset) {
        this.needsReset = false;
        it = this.listeners.values();
        continue;
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
