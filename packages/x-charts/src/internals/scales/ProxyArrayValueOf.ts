export const ProxyArrayValueOf = <T>(array: T[]): T[] & { valueOf: () => T[] } => {
  const proxy = new Proxy(array, {
    get(target, prop, receiver) {
      if (
        typeof prop === 'number' ||
        (typeof prop === 'string' && Number(prop).toString() === prop)
      ) {
        const data = Reflect.get(target, prop, receiver);
        if (Array.isArray(data)) {
          return ProxyArrayValueOf(data);
        }
      }
      if (prop === Symbol.iterator) {
        return function* ProxyArrayValueOfIterator() {
          for (let i = 0; i < target.length; i += 1) {
            const item = target[i];
            if (Array.isArray(item)) {
              yield ProxyArrayValueOf(item);
            } else {
              yield item;
            }
          }
        };
      }
      if (prop === 'valueOf') {
        return () => {
          return target.join('_');
        };
      }
      if (prop === 'proxyName') {
        return 'ProxyArrayValueOf';
      }
      return Reflect.get(target, prop, receiver);
    },
  });
  return proxy as T[] & { valueOf: () => T[]; proxyName: 'ProxyArrayValueOf' };
};
