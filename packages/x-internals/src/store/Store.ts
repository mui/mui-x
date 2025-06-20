type Listener<T> = (value: T) => void;

export class Store<State> {
  public state: State;

  // HACK: Fixes adding listeners that accept partial state.
  private listeners: Set<Listener<any>>;

  static create<T>(state: T) {
    return new Store(state);
  }

  constructor(state: State) {
    this.state = state;
    this.listeners = new Set();
  }

  public subscribe = (fn: Listener<State>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.state;
  };

  public setState(newState: State) {
    this.state = newState;
    this.listeners.forEach((l) => l(newState));
  }

  public update(changes: Partial<State>) {
    for (const key in changes) {
      if (!Object.is(this.state[key], changes[key])) {
        this.setState({ ...this.state, ...changes });
        return;
      }
    }
  }

  public set<T>(key: keyof State, value: T) {
    if (!Object.is(this.state[key], value)) {
      this.setState({ ...this.state, [key]: value });
    }
  }
}
