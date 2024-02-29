type Listener<T> = (value: T) => void;

export type Paths<T> =
  T extends object ?
    {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`
    }[keyof T] :
    never

type ValidatePath<T, K extends string> =
  K extends keyof T ? K :
  K extends `${infer K0}.${infer KR}` ?
  K0 extends keyof T ? `${K0}.${ValidatePath<T[K0], KR>}` : Extract<keyof T, string>
  : Extract<keyof T, string>

type DeepIdx<T, K extends string> =
  K extends keyof T ? T[K] :
  K extends `${infer K0}.${infer KR}` ?
  K0 extends keyof T ? DeepIdx<T[K0], KR> : never
  : never

type Test = { a: { b: number }}

const n: Paths<Test> = 'a'

export class Store<T> {
  value: T;

  listeners: Set<Listener<T>>;
  
  pathListeners: Map<Paths<T>, Set<Listener<T>>>;

  static create<T>(value: T) {
    return new Store(value);
  }

  constructor(value: T) {
    this.value = value;
    this.listeners = new Set<Listener<T>>();
    this.pathListeners = new Map();
  }

  subscribe = (fn: Listener<T>) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  subscribeToPath = (path: Paths<T>, fn: Listener<T>) => {
    let listeners = this.pathListeners.get(path);
    if (!listeners) {
      listeners = new Set();
      this.pathListeners.set(path, listeners);
    }
    listeners.add(fn);
    return () => {
      listeners!.delete(fn);
    };
  };

  getSnapshot = () => {
    return this.value;
  };

  update = (value: T) => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };

  updatePath = <K extends Paths<T>>(
    dotPath: K,
    value: DeepIdx<T, K>
  ) => {
    const path = dotPath.split('.')
    this.value = setPathValue(this.value, value, path)

    for (let i = 0; i < path.length; i++) {
      const currentPath = path.slice(0, i + 1)
      const listeners = this.pathListeners.get(currentPath.join('.') as any)
      if (listeners) {
        const currentValue = getPathValue(this.value, currentPath)
        listeners.forEach((l) => l(currentValue));
      }
    }
  };

  getPath<K extends string>(
    path: K extends ValidatePath<T, K> ? K : ValidatePath<T, K>
  ): DeepIdx<T, K> {
    return getPathValue(this.value, path.split('.'))
  }
}

function setPathValue(
  object: any,
  value: any,
  path: any[],
  pathIndex: number = 0,
) {
  const result = { ...object }
  result[path[pathIndex]] = pathIndex === path.length - 1 ? value : setPathValue(
    object[path[pathIndex]],
    value,
    path,
    pathIndex + 1,
  )
  return result
}

function getPathValue(
  object: any,
  path: any[],
) {
  let result = object;
  for (let i = 0; i < path.length; i++) {
    result = result[path[i]]
  }
  return result
}
