import * as React from 'react';
import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import type { GridCoreApi } from '../models/api/gridCoreApi';
import { warnOnce } from '../internals/utils/warning';

type CacheKey = { id: number };

export interface OutputSelectorV8<State, Args, Result> {
  (
    apiRef: React.MutableRefObject<{ state: State; instanceId: GridCoreApi['instanceId'] }>,
    args: Args,
  ): Result;
  (state: State, instanceId: GridCoreApi['instanceId']): Result;
  acceptsApiRef: boolean;
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

type SelectorResultArrayWithAdditionalArgs<Selectors extends ReadonlyArray<Selector<any>>> = [
  ...SelectorResultArray<Selectors>,
  Record<string, any>,
];

type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> =
  // Input selectors as a separate array
  | [
      selectors: [...Selectors],
      combiner: (...args: SelectorResultArrayWithAdditionalArgs<Selectors>) => Result,
    ]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArrayWithAdditionalArgs<Selectors>) => Result];

type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Args, Result>(
  ...items: SelectorArgs<Selectors, Result>
) => OutputSelectorV8<StateFromSelectorList<Selectors>, Args, Result>;

const cache = new WeakMap<CacheKey, Map<any[], any>>();

function checkIsAPIRef(value: any) {
  return 'current' in value && 'instanceId' in value.current;
}

const DEFAULT_INSTANCE_ID = { id: 'default' };

export const createSelectorV8 = ((
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
    selector = (stateOrApiRef: any, args: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, args, instanceId);
      const vb = b(state, args, instanceId);
      const vc = c(state, args, instanceId);
      const vd = d(state, args, instanceId);
      const ve = e(state, args, instanceId);
      return f(va, vb, vc, vd, ve, args);
    };
  } else if (a && b && c && d && e) {
    selector = (stateOrApiRef: any, args: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, args, instanceId);
      const vb = b(state, args, instanceId);
      const vc = c(state, args, instanceId);
      const vd = d(state, args, instanceId);
      return e(va, vb, vc, vd, args);
    };
  } else if (a && b && c && d) {
    selector = (stateOrApiRef: any, args: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, args, instanceId);
      const vb = b(state, args, instanceId);
      const vc = c(state, args, instanceId);
      return d(va, vb, vc, args);
    };
  } else if (a && b && c) {
    selector = (stateOrApiRef: any, args: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, args, instanceId);
      const vb = b(state, args, instanceId);
      return c(va, vb, args);
    };
  } else if (a && b) {
    selector = (stateOrApiRef: any, args: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, args, instanceId);
      return b(va, args);
    };
  } else {
    throw new Error('Missing arguments');
  }

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsApiRef = true;

  return selector;
}) as unknown as CreateSelectorFunction;

export const createSelectorMemoizedV8: CreateSelectorFunction = (...args: any) => {
  const selector = (stateOrApiRef: any, selectorArgs: any, instanceId?: any) => {
    const isAPIRef = checkIsAPIRef(stateOrApiRef);
    const cacheKey = isAPIRef
      ? stateOrApiRef.current.instanceId
      : (instanceId ?? DEFAULT_INSTANCE_ID);
    const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;

    if (process.env.NODE_ENV !== 'production') {
      if (cacheKey.id === 'default') {
        warnOnce([
          'MUI X: A selector was called without passing the instance ID, which may impact the performance of the grid.',
          'To fix, call it with `apiRef`, for example `mySelector(apiRef)`, or pass the instance ID explicitly, for example `mySelector(state, apiRef.current.instanceId)`.',
        ]);
      }
    }

    const cacheArgsInit = cache.get(cacheKey);
    const cacheArgs = cacheArgsInit ?? new Map();
    const cacheFn = cacheArgs?.get(args);

    if (cacheArgs && cacheFn) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cacheFn(state, selectorArgs, cacheKey);
    }

    const fn = reselectCreateSelector(...args);

    if (!cacheArgsInit) {
      cache.set(cacheKey, cacheArgs);
    }
    cacheArgs.set(args, fn);

    return fn(state, selectorArgs, cacheKey);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsApiRef = true;

  return selector;
};
