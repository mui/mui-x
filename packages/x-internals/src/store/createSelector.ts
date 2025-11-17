import {
  lruMemoize,
  createSelectorCreator,
  OverrideMemoizeOptions,
  UnknownMemoizer,
} from 'reselect';
import type { CreateSelectorFunction } from './createSelectorType';

export type { CreateSelectorFunction } from './createSelectorType';

/* eslint-disable no-underscore-dangle */ // __cacheKey__

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

type SelectorWithArgs = ReturnType<typeof reselectCreateSelector> & { selectorArgs: any[3] };

/* eslint-disable id-denylist */
export const createSelector = ((
  a: Function,
  b: Function,
  c?: Function,
  d?: Function,
  e?: Function,
  f?: Function,
  g?: Function,
  h?: Function,
  ...other: any[]
) => {
  if (other.length > 0) {
    throw new Error('Unsupported number of selectors');
  }

  let selector: any;
  if (a && b && c && d && e && f && g && h) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      const ve = e(state, a1, a2, a3);
      const vf = f(state, a1, a2, a3);
      const vg = g(state, a1, a2, a3);
      return h(va, vb, vc, vd, ve, vf, vg, a1, a2, a3);
    };
  } else if (a && b && c && d && e && f && g) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      const ve = e(state, a1, a2, a3);
      const vf = f(state, a1, a2, a3);
      return g(va, vb, vc, vd, ve, vf, a1, a2, a3);
    };
  } else if (a && b && c && d && e && f) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      const ve = e(state, a1, a2, a3);
      return f(va, vb, vc, vd, ve, a1, a2, a3);
    };
  } else if (a && b && c && d && e) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      const vd = d(state, a1, a2, a3);
      return e(va, vb, vc, vd, a1, a2, a3);
    };
  } else if (a && b && c && d) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      const vc = c(state, a1, a2, a3);
      return d(va, vb, vc, a1, a2, a3);
    };
  } else if (a && b && c) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      const vb = b(state, a1, a2, a3);
      return c(va, vb, a1, a2, a3);
    };
  } else if (a && b) {
    selector = (state: any, a1: any, a2: any, a3: any) => {
      const va = a(state, a1, a2, a3);
      return b(va, a1, a2, a3);
    };
  } else if (a) {
    selector = a;
  } else {
    throw new Error('Missing arguments');
  }

  return selector;
}) as unknown as CreateSelectorFunction;
/* eslint-enable id-denylist */

export const createSelectorMemoizedWithOptions =
  (options?: OverrideMemoizeOptions<UnknownMemoizer>): CreateSelectorFunction =>
  (...inputs: any[]) => {
    type CacheKey = { id: number };

    const cache = new WeakMap<CacheKey, SelectorWithArgs>();
    let nextCacheId = 1;

    const combiner = inputs[inputs.length - 1];
    const nSelectors = inputs.length - 1 || 1;
    // (s1, s2, ..., sN, a1, a2, a3) => { ... }
    const argsLength = Math.max(combiner.length - nSelectors, 0);

    if (argsLength > 3) {
      throw new Error('Unsupported number of arguments');
    }

    // prettier-ignore
    const selector = (state: any, a1: any, a2: any, a3: any) => {
    let cacheKey = state.__cacheKey__;
    if (!cacheKey) {
      cacheKey = { id: nextCacheId };
      state.__cacheKey__ = cacheKey;
      nextCacheId += 1;
    }

    let fn = cache.get(cacheKey);
    if (!fn) {
      const selectors = inputs.length === 1 ? [((x: any) => x), combiner] : inputs
      let reselectArgs = inputs;
      const selectorArgs = [undefined, undefined, undefined];
      switch (argsLength) {
        case 0:
          break;
        case 1: {
          reselectArgs = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            combiner
          ];
          break;
        }
        case 2: {
          reselectArgs = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            () => selectorArgs[1],
            combiner,
          ];
          break;
        }
        case 3: {
          reselectArgs = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            () => selectorArgs[1],
            () => selectorArgs[2],
            combiner,
          ];
          break;
        }
        default:
          throw new Error('Unsupported number of arguments');
      }
      if (options) {
        reselectArgs = [...reselectArgs, options];
      }

      fn = reselectCreateSelector(...(reselectArgs as any)) as unknown as SelectorWithArgs;
      fn.selectorArgs = selectorArgs;

      cache.set(cacheKey, fn);
    }

    /* eslint-disable no-fallthrough */

    switch (argsLength) {
      case 3: fn.selectorArgs[2] = a3;
      case 2: fn.selectorArgs[1] = a2;
      case 1: fn.selectorArgs[0] = a1;
      case 0:
      default:
    }
    switch (argsLength) {
      case 0: return fn(state);
      case 1: return fn(state, a1);
      case 2: return fn(state, a1, a2);
      case 3: return fn(state, a1, a2, a3);
      default:
        throw new Error('unreachable');
    }
  };

    return selector as any;
  };

export const createSelectorMemoized = createSelectorMemoizedWithOptions();
