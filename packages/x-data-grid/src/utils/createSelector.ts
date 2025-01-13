import * as React from 'react';
import { lruMemoize, createSelectorCreator, Selector, SelectorResultArray } from 'reselect';
import { warnOnce } from '@mui/x-internals/warning';
import type { GridCoreApi } from '../models/api/gridCoreApi';
import { argsEqual } from '../hooks/utils/useGridSelector';

type CacheKey = { id: number };

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

type GridCreateSelectorFunction = ReturnType<typeof reselectCreateSelector> & {
  selectorArgs?: any;
};

// TODO v8: Remove this type
export interface OutputSelector<State, Result> {
  (apiRef: React.RefObject<{ state: State; instanceId: GridCoreApi['instanceId'] }>): Result;
  (state: State, instanceId: GridCoreApi['instanceId']): Result;
  acceptsApiRef: boolean;
}

// TODO v8: Rename this type to `OutputSelector`
export interface OutputSelectorV8<State, Args, Result> {
  (
    apiRef: React.RefObject<{ state: State; instanceId: GridCoreApi['instanceId'] }>,
    args?: Args,
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

// TODO v8: Remove this type
type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> =
  // Input selectors as a separate array
  | [selectors: [...Selectors], combiner: (...args: SelectorResultArray<Selectors>) => Result]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArray<Selectors>) => Result];

type SelectorResultArrayWithArgs<Selectors extends ReadonlyArray<Selector<any>>, Args> = [
  ...SelectorResultArray<Selectors>,
  Args,
];

// TODO v8: Rename this type to `SelectorArgs`
type SelectorArgsV8<Selectors extends ReadonlyArray<Selector<any>>, Args, Result> =
  // Input selectors as a separate array
  | [
      selectors: [...Selectors],
      combiner: (...args: SelectorResultArrayWithArgs<Selectors, Args>) => Result,
    ]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArrayWithArgs<Selectors, Args>) => Result];

// TODO v8: Remove this type
type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Result>(
  ...items: SelectorArgs<Selectors, Result>
) => OutputSelector<StateFromSelectorList<Selectors>, Result>;

// TODO v8: Rename this type to `CreateSelectorFunction`
type CreateSelectorFunctionV8 = <Selectors extends ReadonlyArray<Selector<any>>, Args, Result>(
  ...items: SelectorArgsV8<Selectors, Args, Result>
) => OutputSelectorV8<StateFromSelectorList<Selectors>, Args, Result>;

const cache = new WeakMap<CacheKey, Map<any[], any>>();

function checkIsAPIRef(value: any) {
  return 'current' in value && 'instanceId' in value.current;
}

const DEFAULT_INSTANCE_ID = { id: 'default' };

// TODO v8: Remove this function
export const createSelector = ((
  a: Function,
  b: Function,
  c?: Function,
  d?: Function,
  // eslint-disable-next-line id-denylist
  e?: Function,
  f?: Function,
  ...other: any[]
) => {
  if (other.length > 0) {
    throw new Error('Unsupported number of selectors');
  }

  let selector: any;

  // eslint-disable-next-line id-denylist
  if (a && b && c && d && e && f) {
    selector = (stateOrApiRef: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      const vd = d(state, instanceId);
      const ve = e(state, instanceId);
      return f(va, vb, vc, vd, ve);
    };
    // eslint-disable-next-line id-denylist
  } else if (a && b && c && d && e) {
    selector = (stateOrApiRef: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      const vd = d(state, instanceId);
      return e(va, vb, vc, vd);
    };
  } else if (a && b && c && d) {
    selector = (stateOrApiRef: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      const vc = c(state, instanceId);
      return d(va, vb, vc);
    };
  } else if (a && b && c) {
    selector = (stateOrApiRef: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, instanceId);
      const vb = b(state, instanceId);
      return c(va, vb);
    };
  } else if (a && b) {
    selector = (stateOrApiRef: any, instanceIdParam: any) => {
      const isAPIRef = checkIsAPIRef(stateOrApiRef);
      const instanceId =
        instanceIdParam ?? (isAPIRef ? stateOrApiRef.current.instanceId : DEFAULT_INSTANCE_ID);
      const state = isAPIRef ? stateOrApiRef.current.state : stateOrApiRef;
      const va = a(state, instanceId);
      return b(va);
    };
  } else {
    throw new Error('Missing arguments');
  }

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsApiRef = true;

  return selector;
}) as unknown as CreateSelectorFunction;

// TODO v8: Rename this function to `createSelector`
export const createSelectorV8 = ((
  a: Function,
  b: Function,
  c?: Function,
  d?: Function,
  // eslint-disable-next-line id-denylist
  e?: Function,
  f?: Function,
  ...other: any[]
) => {
  if (other.length > 0) {
    throw new Error('Unsupported number of selectors');
  }

  let selector: any;

  // eslint-disable-next-line id-denylist
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
    // eslint-disable-next-line id-denylist
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
}) as unknown as CreateSelectorFunctionV8;

// TODO v8: Remove this function
export const createSelectorMemoized: CreateSelectorFunction = (...args: any) => {
  const selector = (stateOrApiRef: any, instanceId?: any) => {
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
  selector.acceptsApiRef = true;

  return selector;
};

// TODO v8: Rename this function to `createSelectorMemoized`
export const createSelectorMemoizedV8: CreateSelectorFunctionV8 = (...args: any) => {
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
      if (!argsEqual(cacheFn.selectorArgs, selectorArgs)) {
        const reselectArgs =
          selectorArgs !== undefined
            ? [...args.slice(0, args.length - 1), () => selectorArgs, args[args.length - 1]]
            : args;
        const fn: GridCreateSelectorFunction = reselectCreateSelector(...reselectArgs);
        fn.selectorArgs = selectorArgs;
        cacheArgs.set(args, fn);
        return fn(state, selectorArgs, cacheKey);
      }
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cacheFn(state, selectorArgs, cacheKey);
    }

    const reselectArgs =
      selectorArgs !== undefined
        ? [...args.slice(0, args.length - 1), () => selectorArgs, args[args.length - 1]]
        : args;

    const fn: GridCreateSelectorFunction = reselectCreateSelector(...reselectArgs);
    fn.selectorArgs = selectorArgs;

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
