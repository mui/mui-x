type Listener<T> = (value: T) => void;

let globalId = 0;

export class Store<TState, TCache> {
  private value: { state: TState; cache: TCache };

  public instanceId: number;

  listeners: Set<Listener<typeof this.value>>;

  constructor(value: typeof this.value) {
    this.value = value;
    this.listeners = new Set();
    this.instanceId = globalId;

    globalId += 1;
  }

  public subscribe = (fn: Listener<typeof this.value>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  public getSnapshot = () => {
    return this.value;
  };

  private update = (value: typeof this.value) => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };

  public getCache = () => {
    return this.value.cache;
  };

  public updateState = (state: TState) => {
    this.update({ ...this.value, state });
  };

  public updateCache = (cache: TCache) => {
    this.update({ ...this.value, cache });
  };
}
