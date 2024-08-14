import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import { warnOnce } from './warning';
import { UseTreeViewSelectorsInstance } from '../corePlugins/useTreeViewSelectors';

type CacheKey = { id: number };

export interface OutputSelector<TState extends {}, Result> {
  (instance: UseTreeViewSelectorsInstance<TState>): Result;
  (state: TState, instanceId: number): Result;
  acceptsInstance: boolean;
}

type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any
  ? F extends { state: infer F2 }
    ? F2
    : F
  : never;

type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [
  f: infer F,
  ...other: infer R,
]
  ? StateFromSelector<F> extends StateFromSelectorList<R>
    ? StateFromSelector<F>
    : StateFromSelectorList<R>
  : {};

type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> =
  // Input selectors as a separate array
  | [selectors: [...Selectors], combiner: (...args: SelectorResultArray<Selectors>) => Result]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArray<Selectors>) => Result];

type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Result>(
  ...items: SelectorArgs<Selectors, Result>
) => OutputSelector<StateFromSelectorList<Selectors>, Result>;

const cache = new WeakMap<CacheKey, Map<any[], any>>();

function checkIsAPIRef(value: any) {
  return 'selectorsCache' in value && 'instanceId' in value.selectorsCache;
}

const DEFAULT_INSTANCE_ID = -1;

export const createSelector = ((
  a: Function,
  b: Function,
  c?: Function,
  d?: Function,
  e?: Function,
  f?: Function,
  ...other: any[]
) => {
  if (other.length > 0) {
    throw new Error('Unsupported number of selectors');
  }

  let selector: any;

  if (a && b && c && d && e && f) {
    selector = (stateOrInstance: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrInstance);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrInstance.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrInstance.current.state : stateOrInstance;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      const vd = d(state, instanceId);
      const ve = e(state, instanceId);
      return f(va, vb, vc, vd, ve);
    };
  } else if (a && b && c && d && e) {
    selector = (stateOrInstance: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrInstance);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrInstance.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrInstance.current.state : stateOrInstance;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      const vd = d(state, instanceId);
      return e(va, vb, vc, vd);
    };
  } else if (a && b && c && d) {
    selector = (stateOrInstance: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrInstance);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrInstance.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrInstance.current.state : stateOrInstance;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      return d(va, vb, vc);
    };
  } else if (a && b && c) {
    selector = (stateOrInstance: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrInstance);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrInstance.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrInstance.current.state : stateOrInstance;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      return c(va, vb);
    };
  } else if (a && b) {
    selector = (stateOrInstance: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrInstance);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrInstance.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrInstance.current.state : stateOrInstance;
      const va = a(state, instanceId);
      return b(va);
    };
  } else {
    throw new Error('Missing arguments');
  }

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsInstance = true;

  return selector;
}) as unknown as CreateSelectorFunction;

export const createSelectorMemoized: CreateSelectorFunction = (...args: any) => {
  const selector = (stateOrApiRef: any, instanceId?: any) => {
    const isAPIRef = checkIsAPIRef(stateOrApiRef);
    const cacheKey = isAPIRef
      ? stateOrApiRef.current.instanceId
      : (instanceId ?? DEFAULT_INSTANCE_ID);
    const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;

    if (process.env.NODE_ENV !== 'production') {
      if (cacheKey === -1) {
        warnOnce([
          'MUI X: A selector was called without passing the instance ID, which may impact the performance of the tree view.',
          'To fix, call it with `instance`, for example `mySelector(instance)`, or pass the instance ID explicitly, for example `mySelector(state, instance.current.selectorsCache.instanceId)`.',
        ]);
      }
    }

    const cacheArgsInit = cache.get(cacheKey);
    const cacheArgs = cacheArgsInit ?? new Map();
    const cacheFn = cacheArgs?.get(args);

    if (cacheArgs && cacheFn) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cacheFn(state, cacheKey);
    }

    const fn = reselectCreateSelector(...args);

    if (!cacheArgsInit) {
      cache.set(cacheKey, cacheArgs);
    }
    cacheArgs.set(args, fn);

    return fn(state, cacheKey);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsInstance = true;

  return selector;
};
