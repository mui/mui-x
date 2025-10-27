import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { ProxyArrayValueOf } from './ProxyArrayValueOf';

export const ProxyScaleDomain = <Scale extends ScalePoint<any> | ScaleBand<any>>(
  scale: Scale,
): Scale => {
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
        return (domainArray: any[]) => {
          if (Array.isArray(domainArray)) {
            return Reflect.get(target, prop, receiver)(ProxyArrayValueOf(domainArray) as any);
          }

          if (domainArray !== undefined) {
            return Reflect.get(target, prop, receiver)(domainArray);
          }

          return Reflect.get(target, prop, receiver)();
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy as Scale;
};
