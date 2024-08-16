type Listener<T> = (value: T) => void;

export class Store<T> {
  value: T;

  listeners: Set<Listener<T>>;

  static create<T>(value: T) {
    return new Store(value);
  }

  constructor(value: T) {
    this.value = value;
    this.listeners = new Set<Listener<T>>();
  }

  subscribe = (fn: Listener<T>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => {
    return this.value;
  };

  update = (value: T) => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };
}
