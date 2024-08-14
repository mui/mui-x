type Listener<T> = (value: T) => void;

let globalId = 0;

export class Store<T> {
  value: T;

  public instanceId: number;

  listeners: Set<Listener<T>>;

  static create<T>(value: T) {
    return new Store(value);
  }

  constructor(value: T) {
    this.value = value;
    this.listeners = new Set<Listener<T>>();
    this.instanceId = globalId;

    globalId += 1;
  }

  public subscribe = (fn: Listener<T>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => {
    return this.value;
  };

  public update = (value: T) => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };
}
