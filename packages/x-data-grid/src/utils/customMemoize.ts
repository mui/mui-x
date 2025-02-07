// Original source:
// - https://github.com/reduxjs/reselect/blob/1c3fc05f041d32cd69c11a7f7deccf0bce6f4598/src/weakMapMemoize.ts

/**
 * An alias for type `{}`. Represents any value that is not `null` or `undefined`.
 * It is mostly used for semantic purposes to help distinguish between an
 * empty object type and `{}` as they are not the same.
 *
 * @internal
 */
export type AnyNonNullishValue = NonNullable<unknown>;

/**
 * Useful to flatten the type output to improve type hints shown in editors.
 * And also to transform an interface into a type to aide with assignability.
 * @see {@link https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts Source}
 *
 * @internal
 */
export type Simplify<T> = T extends AnyFunction
  ? T
  : {
      [KeyType in keyof T]: T[KeyType];
    } & AnyNonNullishValue;

/**
 * A standard function returning true if two values are considered equal.
 *
 * @public
 */
export type EqualityFn<T = any> = (a: T, b: T) => boolean;

/**
 * Represents the additional properties attached to a function memoized by `reselect`.
 *
 * `lruMemoize`, `weakMapMemoize` and `autotrackMemoize` all return these properties.
 *
 * @see {@linkcode ExtractMemoizerFields ExtractMemoizerFields}
 *
 * @public
 */
export type DefaultMemoizeFields = {
  /**
   * Clears the memoization cache associated with a memoized function.
   * This method is typically used to reset the state of the cache, allowing
   * for the garbage collection of previously memoized results and ensuring
   * that future calls to the function recompute the results.
   */
  clearCache: () => void;
  resultsCount: () => number;
  resetResultsCount: () => void;
};

/**
 * Any function with any arguments.
 *
 * @internal
 */
export type AnyFunction = (...args: any[]) => any;

class StrongRef<T> {
  constructor(private value: T) {}

  deref() {
    return this.value;
  }
}

/**
 * @returns The {@linkcode StrongRef} if {@linkcode WeakRef} is not available.
 *
 * @since 5.1.2
 * @internal
 */
const getWeakRef = () =>
  typeof WeakRef === 'undefined' ? (StrongRef as unknown as typeof WeakRef) : WeakRef;

const Ref = /** @__PURE__ */ getWeakRef();

const UNTERMINATED = 0;
const TERMINATED = 1;

interface UnterminatedCacheNode<T> {
  /**
   * Status, represents whether the cached computation returned a value or threw an error.
   */
  s: 0;
  /**
   * Value, either the cached result or an error, depending on status.
   */
  v: void;
  /**
   * Object cache, a `WeakMap` where non-primitive arguments are stored.
   */
  o: null | WeakMap<Function | Object, CacheNode<T>>;
  /**
   * Primitive cache, a regular Map where primitive arguments are stored.
   */
  p: null | Map<string | number | null | void | symbol | boolean, CacheNode<T>>;
}

interface TerminatedCacheNode<T> {
  /**
   * Status, represents whether the cached computation returned a value or threw an error.
   */
  s: 1;
  /**
   * Value, either the cached result or an error, depending on status.
   */
  v: T;
  /**
   * Object cache, a `WeakMap` where non-primitive arguments are stored.
   */
  o: null | WeakMap<Function | Object, CacheNode<T>>;
  /**
   * Primitive cache, a regular `Map` where primitive arguments are stored.
   */
  p: null | Map<string | number | null | void | symbol | boolean, CacheNode<T>>;
}

type CacheNode<T> = TerminatedCacheNode<T> | UnterminatedCacheNode<T>;

function createCacheNode<T>(): CacheNode<T> {
  return {
    s: UNTERMINATED,
    v: undefined,
    o: null,
    p: null,
  };
}

/**
 * Configuration options for a memoization function utilizing `WeakMap` for
 * its caching mechanism.
 *
 * @template Result - The type of the return value of the memoized function.
 *
 * @since 5.0.0
 * @public
 */
export interface WeakMapMemoizeOptions<Result = any> {
  /**
   * If provided, used to compare a newly generated output value against previous values in the cache.
   * If a match is found, the old value is returned. This addresses the common
   * ```ts
   * todos.map(todo => todo.id)
   * ```
   * use case, where an update to another field in the original data causes a recalculation
   * due to changed references, but the output is still effectively the same.
   *
   * @since 5.0.0
   */
  resultEqualityCheck?: EqualityFn<Result>;
}

/**
 * Derefences the argument if it is a Ref. Else if it is a value already, return it.
 *
 * @param r - the object to maybe deref
 * @returns The derefenced value if the argument is a Ref, else the argument value itself.
 */
function maybeDeref(r: any) {
  if (r instanceof Ref) {
    return r.deref();
  }

  return r;
}

/**
 * Creates a tree of `WeakMap`-based cache nodes based on the identity of the
 * arguments it's been called with (in this case, the extracted values from your input selectors).
 * This allows `weakMapMemoize` to have an effectively infinite cache size.
 * Cache results will be kept in memory as long as references to the arguments still exist,
 * and then cleared out as the arguments are garbage-collected.
 *
 * __Design Tradeoffs for `weakMapMemoize`:__
 * - Pros:
 *   - It has an effectively infinite cache size, but you have no control over
 *   how long values are kept in cache as it's based on garbage collection and `WeakMap`s.
 * - Cons:
 *   - There's currently no way to alter the argument comparisons.
 *   They're based on strict reference equality.
 *   - It's roughly the same speed as `lruMemoize`, although likely a fraction slower.
 *
 * __Use Cases for `weakMapMemoize`:__
 * - This memoizer is likely best used for cases where you need to call the
 * same selector instance with many different arguments, such as a single
 * selector instance that is used in a list item component and called with
 * item IDs like:
 *   ```ts
 *   useSelector(state => selectSomeData(state, props.category))
 *   ```
 * @param func - The function to be memoized.
 * @returns A memoized function with a `.clearCache()` method attached.
 *
 * @example
 * <caption>Using `createSelector`</caption>
 * ```ts
 * import { createSelector, weakMapMemoize } from 'reselect'
 *
 * interface RootState {
 *   items: { id: number; category: string; name: string }[]
 * }
 *
 * const selectItemsByCategory = createSelector(
 *   [
 *     (state: RootState) => state.items,
 *     (state: RootState, category: string) => category
 *   ],
 *   (items, category) => items.filter(item => item.category === category),
 *   {
 *     memoize: weakMapMemoize,
 *     argsMemoize: weakMapMemoize
 *   }
 * )
 * ```
 *
 * @example
 * <caption>Using `createSelectorCreator`</caption>
 * ```ts
 * import { createSelectorCreator, weakMapMemoize } from 'reselect'
 *
 * const createSelectorWeakMap = createSelectorCreator({ memoize: weakMapMemoize, argsMemoize: weakMapMemoize })
 *
 * const selectItemsByCategory = createSelectorWeakMap(
 *   [
 *     (state: RootState) => state.items,
 *     (state: RootState, category: string) => category
 *   ],
 *   (items, category) => items.filter(item => item.category === category)
 * )
 * ```
 *
 * @template Func - The type of the function that is memoized.
 *
 * @see {@link https://reselect.js.org/api/weakMapMemoize `weakMapMemoize`}
 *
 * @since 5.0.0
 * @public
 * @experimental
 */
export function weakMapMemoize<Func extends AnyFunction>(
  func: Func,
  options: WeakMapMemoizeOptions<ReturnType<Func>> = {},
) {
  let fnNode = createCacheNode();
  const { resultEqualityCheck } = options;

  let lastResult: WeakRef<object> | undefined;

  let resultsCount = 0;

  function memoized() {
    let cacheNode = fnNode;
    // eslint-disable-next-line prefer-rest-params
    const { length } = arguments;
    for (let i = 0, l = length; i < l; i += 1) {
      // eslint-disable-next-line prefer-rest-params
      let arg = arguments[i];
      if (typeof arg === 'function' || (typeof arg === 'object' && arg !== null)) {
        // Following logic is added over the original `weakMapMemoize` to support the proper memoization of the `GridApiRef`
        if ('current' in arg && 'instanceId' in arg.current) {
          arg = arg.current.state;
        }
        // Objects go into a WeakMap
        let objectCache = cacheNode.o;
        if (objectCache === null) {
          objectCache = new WeakMap();
          cacheNode.o = objectCache;
        }
        const objectNode = objectCache.get(arg);
        if (objectNode === undefined) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        // Primitives go into a regular Map
        let primitiveCache = cacheNode.p;
        if (primitiveCache === null) {
          primitiveCache = new Map();
          cacheNode.p = primitiveCache;
        }
        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === undefined) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }

    const terminatedNode = cacheNode as unknown as TerminatedCacheNode<any>;

    let result;

    if (cacheNode.s === TERMINATED) {
      result = cacheNode.v;
    } else {
      // Allow errors to propagate
      // eslint-disable-next-line prefer-spread, prefer-rest-params
      result = func.apply(null, arguments as unknown as any[]);
      resultsCount += 1;

      if (resultEqualityCheck) {
        // Deref lastResult if it is a Ref
        const lastResultValue = maybeDeref(lastResult);

        if (
          lastResultValue != null &&
          resultEqualityCheck(lastResultValue as ReturnType<Func>, result)
        ) {
          result = lastResultValue;

          if (resultsCount !== 0) {
            resultsCount -= 1;
          }
        }

        const needsWeakRef =
          (typeof result === 'object' && result !== null) || typeof result === 'function';

        lastResult = needsWeakRef ? /** @__PURE__ */ new Ref(result) : result;
      }
    }

    terminatedNode.s = TERMINATED;

    terminatedNode.v = result;
    return result;
  }

  memoized.clearCache = () => {
    fnNode = createCacheNode();
    memoized.resetResultsCount();
  };

  memoized.resultsCount = () => resultsCount;

  memoized.resetResultsCount = () => {
    resultsCount = 0;
  };

  return memoized as Func & Simplify<DefaultMemoizeFields>;
}
