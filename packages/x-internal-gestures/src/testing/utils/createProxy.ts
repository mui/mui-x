import type { UserGesture, UserGestureOptions } from '..';

export const createProxy = <T extends UserGesture>(target: T): T => {
  const proxy = new Proxy(target, {
    get(obj, prop) {
      if (prop === 'setup') {
        return (options: UserGestureOptions) => {
          const mode = Reflect.get(obj, 'pointerManager').mode;

          // Calling setup pretty much clears this proxy by creating a new instance
          // This new instance will NOT be a proxy.
          // @ts-expect-error, constructor is a function...
          return new obj.constructor(mode).setup(options);
        };
      }

      const value = Reflect.get(obj, prop);

      // If the property is not a function, we return it as is.
      if (typeof value !== 'function') {
        return value;
      }

      // If we are trying to call a method on the proxy,
      // we ensure that we clear the pointers after the method is called.
      // This is useful for tests where we want to ensure no pointers are left hanging
      return async (...args: unknown[]) => {
        await value.bind(obj)(...args);
        const pointerManager = Reflect.get(obj, 'pointerManager');
        Reflect.get(pointerManager, 'clearPointers').bind(pointerManager)();
      };
    },
  });

  return proxy;
};
