import { lruMemoize, LruMemoizeOptions } from '../lruMemoize/lruMemoize';
import { weakMapMemoize } from './weakMapMemoize';
import type { CreateSelectorFunction } from './createSelectorType';

export type { CreateSelectorFunction } from './createSelectorType';

/* eslint-disable no-underscore-dangle */ // __cacheKey__

interface MemoizedSelectorOptions {
  memoizeOptions?: LruMemoizeOptions;
}

/**
 * Combines input selectors and a combiner into a single memoized selector,
 * with the same memoization strategy as `reselect`:
 * the combiner is memoized on its input values (latest call only),
 * while the selector itself is memoized on its arguments with a weak cache.
 */
function createMemoizedSelector(
  selectorsAndCombiner: Function[],
  options?: MemoizedSelectorOptions,
): SelectorWithArgs {
  const combiner = selectorsAndCombiner[selectorsAndCombiner.length - 1];
  const inputSelectors = selectorsAndCombiner.slice(0, -1);
  const memoizedCombiner = lruMemoize(
    combiner as (...args: any[]) => any,
    options?.memoizeOptions ?? { equalityCheck: Object.is },
  );

  return weakMapMemoize((...args: any[]) => {
    const values = inputSelectors.map((inputSelector) => inputSelector(...args));
    return memoizedCombiner(...values);
  }) as unknown as SelectorWithArgs;
}

type SelectorWithArgs = ((...args: any[]) => any) & { selectorArgs: any[3] };

/**
 * Creates a selector function that can be used to derive values from the store's state.
 *
 * The combiner function can have up to three additional parameters, but it **cannot have optional or default parameters**.
 *
 * This function accepts up to six functions and combines them into a single selector function.
 * The resulting selector will take the state from the combined selectors and any additional parameters required by the combiner.
 *
 * The return type of the resulting selector is determined by the return type of the combiner function.
 *
 * @example
 * const selector = createSelector(
 *  (state) => state.disabled
 * );
 *
 * @example
 * const selector = createSelector(
 *   (state) => state.disabled,
 *   (state) => state.open,
 *   (disabled, open) => ({ disabled, open })
 * );
 */
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
    throw new Error(
      'MUI X: Unsupported number of selectors. ' +
        'The createSelector function supports up to 8 input selectors. ' +
        'Consider combining selectors or restructuring your selector logic.',
    );
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
    throw new Error(
      'MUI X: Missing arguments for createSelector. ' +
        'At least one selector function is required. ' +
        'Provide one or more selector functions as arguments.',
    );
  }

  return selector;
}) as unknown as CreateSelectorFunction;
/* eslint-enable id-denylist */

export const createSelectorMemoizedWithOptions =
  (options?: MemoizedSelectorOptions): CreateSelectorFunction =>
  (...inputs: any[]) => {
    type CacheKey = { id: number };

    const cache = new WeakMap<CacheKey, SelectorWithArgs>();
    let nextCacheId = 1;

    const combiner = inputs[inputs.length - 1];
    const nSelectors = inputs.length - 1 || 1;
    // (s1, s2, ..., sN, a1, a2, a3) => { ... }
    const argsLength = Math.max(combiner.length - nSelectors, 0);

    if (argsLength > 3) {
      throw new Error(
        'MUI X: Unsupported number of arguments for selector combiner. ' +
          'The combiner function supports up to 3 additional arguments beyond the selector outputs. ' +
          'Consider restructuring your selector to use fewer arguments.',
      );
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
      let selectorsAndCombiner = inputs;
      const selectorArgs = [undefined, undefined, undefined];
      switch (argsLength) {
        case 0:
          break;
        case 1: {
          selectorsAndCombiner = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            combiner
          ];
          break;
        }
        case 2: {
          selectorsAndCombiner = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            () => selectorArgs[1],
            combiner,
          ];
          break;
        }
        case 3: {
          selectorsAndCombiner = [
            ...selectors.slice(0, -1),
            () => selectorArgs[0],
            () => selectorArgs[1],
            () => selectorArgs[2],
            combiner,
          ];
          break;
        }
        default:
          throw new Error(
            'MUI X: Unsupported number of arguments for selector. ' +
              'The memoized selector supports up to 3 additional arguments. ' +
              'Consider restructuring your selector to use fewer arguments.',
          );
      }
      fn = createMemoizedSelector(selectorsAndCombiner as Function[], options);
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
        throw /* minify-error-disabled */ new Error('unreachable');
    }
  };

    return selector as any;
  };

/**
 * Creates a memoized selector function that can be used to derive values from the store's state.
 * This is useful for selectors that produce non-primitive values, such as objects or arrays, where memoization can help prevent unnecessary re-renders in React components.
 *
 * The memoization is implemented in a way that only the most recent selector result is cached.
 * This is suitable for cases where the selector is called with the same state and arguments repeatedly,
 * but may not be ideal for selectors that are called with a wide variety of states and arguments.
 *
 * The combiner function can have up to three additional parameters, but it **cannot have optional or default parameters**.
 *
 * This function accepts up to six functions and combines them into a single selector function.
 * The resulting selector will take the state from the combined selectors and any additional parameters required by the combiner.
 *
 * The return type of the resulting selector is determined by the return type of the combiner function.
 *
 * @example
 * const selector = createSelectorMemoized(
 *  (state) => state.disabled
 * );
 *
 * @example
 * const selector = createSelectorMemoized(
 *   (state) => state.disabled,
 *   (state) => state.open,
 *   (disabled, open) => ({ disabled, open })
 * );
 */
export const createSelectorMemoized = createSelectorMemoizedWithOptions();
