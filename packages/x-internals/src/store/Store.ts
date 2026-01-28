import { useStore } from './useStore';

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

  /**
   * Returns the current state snapshot. Meant for usage with `useSyncExternalStore`.
   * If you want to access the state, use the `state` property instead.
   */
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

  set<Key extends keyof State, T extends State[Key]>(key: Key, value: T) {
    if (!Object.is(this.state[key], value)) {
      this.setState({ ...this.state, [key]: value });
    }
  }

  public use = ((selector: any, a1?: unknown, a2?: unknown, a3?: unknown) => {
    return useStore(this, selector, a1, a2, a3);
  }) as <F extends (...args: any) => any>(selector: F, ...args: SelectorArgs<F>) => ReturnType<F>;
}

export type ReadonlyStore<State> = Pick<Store<State>, 'getSnapshot' | 'subscribe' | 'state'>;

type SelectorArgs<Selector> = Selector extends (...params: infer Params) => any
  ? Tail<Params>
  : never;

type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest] ? Rest : [];
