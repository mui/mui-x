import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { ProxyArrayValueOf } from './ProxyArrayValueOf';

export const ProxyScale = <Scale extends ScalePoint<any> | ScaleBand<any>>(scale: Scale): Scale => {
  const proxy = new Proxy(scale, {
    apply(target, receiver, args) {
      const [arg0, ...argOther] = args;
      if (Array.isArray(arg0)) {
        return Reflect.apply(target, receiver, [ProxyArrayValueOf(arg0), ...argOther]);
      }
      return Reflect.apply(target, receiver, args);
    },
    get(target, prop, receiver) {
      if (prop === 'domain') {
        return (domain: any) => {
          if (Array.isArray(domain)) {
            return Reflect.get(target, prop, receiver)(ProxyArrayValueOf(domain) as any);
          }

          if (domain !== undefined) {
            return Reflect.get(target, prop, receiver)(domain);
          }

          return ProxyArrayValueOf(Reflect.get(target, prop, receiver)());
        };
      }
      if (prop === 'copy') {
        return () => {
          const copiedScale = Reflect.get(target, prop, receiver)();
          return ProxyScale(copiedScale);
        };
      }
      // These methods return 'this' for chaining, so we need to return the proxy
      if (
        prop === 'paddingInner' ||
        prop === 'paddingOuter' ||
        prop === 'padding' ||
        prop === 'align' ||
        prop === 'round'
      ) {
        return (...args: any[]) => {
          const method = Reflect.get(target, prop, receiver) as Function;
          method.apply(target, args);
          return receiver;
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy as Scale;
};
