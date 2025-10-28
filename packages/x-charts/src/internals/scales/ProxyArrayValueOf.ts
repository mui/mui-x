export const ProxyArrayValueOf = <T>(array: T[]): T[] & { valueOf: () => T[] } => {
  const proxy = new Proxy(array, {
    get(target, prop, receiver) {
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

      return Reflect.get(target, prop, receiver);
    },
  });
  return proxy as T[] & { valueOf: () => T[] };
};
