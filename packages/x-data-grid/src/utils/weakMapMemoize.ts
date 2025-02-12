// Original source:
// - https://github.com/reduxjs/reselect/blob/1c3fc05f041d32cd69c11a7f7deccf0bce6f4598/src/weakMapMemoize.ts

type AnyNonNullishValue = NonNullable<unknown>;

type Simplify<T> = T extends AnyFunction
  ? T
  : {
      [KeyType in keyof T]: T[KeyType];
    } & AnyNonNullishValue;

type EqualityFn<T = any> = (a: T, b: T) => boolean;

type DefaultMemoizeFields = {
  clearCache: () => void;
  resultsCount: () => number;
  resetResultsCount: () => void;
};

type AnyFunction = (...args: any[]) => any;

class StrongRef<T> {
  constructor(private value: T) {}

  deref() {
    return this.value;
  }
}

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

interface WeakMapMemoizeOptions<Result = any> {
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
 * Inspired by the `weakMapMemoize` function from the `reselect` library.
 *
 * @see {@link https://github.com/reduxjs/reselect/blob/1c3fc05f041d32cd69c11a7f7deccf0bce6f4598/src/weakMapMemoize.ts `original source code`}
 * @see {@link https://reselect.js.org/api/weakMapMemoize `weakMapMemoize api docs`}
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
