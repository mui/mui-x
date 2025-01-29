import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { RefObject } from '@mui/x-internals/types';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { warnOnce } from '@mui/x-internals/warning';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import type { OutputSelector } from '../../utils/createSelector';
import { useLazyRef } from './useLazyRef';
import type { GridCoreApi } from '../../models/api/gridCoreApi';

function isOutputSelector<Api extends GridApiCommon, Args, T>(
  selector: any,
): selector is OutputSelector<Api['state'], Args, T> {
  return selector.acceptsApiRef;
}

type Selector<Api extends GridApiCommon, Args, T> =
  | ((state: Api['state']) => T)
  | OutputSelector<Api['state'], Args, T>;

function applySelector<Api extends GridApiCommon, Args, T>(
  apiRef: RefObject<Api>,
  selector: Selector<Api, Args, T>,
  args: Args,
  instanceId: GridCoreApi['instanceId'],
) {
  if (isOutputSelector(selector)) {
    return selector(apiRef, args);
  }
  return selector(apiRef.current.state, args, instanceId);
}

const defaultCompare = Object.is;
export const objectShallowCompare = fastObjectShallowCompare as (a: unknown, b: unknown) => boolean;
const arrayShallowCompare = (a: any[], b: any[]) => {
  if (a === b) {
    return true;
  }

  return a.length === b.length && a.every((v, i) => v === b[i]);
};

export const argsEqual = (prev: any, curr: any) => {
  let fn = Object.is;
  if (curr instanceof Array) {
    fn = arrayShallowCompare;
  } else if (curr instanceof Object) {
    fn = objectShallowCompare;
  }
  return fn(prev, curr);
};

const createRefs = () => ({ state: null, equals: null, selector: null, args: null }) as any;

const EMPTY = [] as unknown[];

export const useGridSelector = <Api extends GridApiCommon, Args, T>(
  apiRef: RefObject<Api>,
  selector: Selector<Api, Args, T>,
  args: Args = undefined as Args,
  equals: <U = T>(a: U, b: U) => boolean = defaultCompare,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!apiRef.current.state) {
      warnOnce([
        'MUI X: `useGridSelector` has been called before the initialization of the state.',
        'This hook can only be used inside the context of the grid.',
      ]);
    }
  }

  const refs = useLazyRef<
    {
      state: T;
      equals: typeof equals;
      selector: typeof selector;
      args: typeof args;
    },
    never
  >(createRefs);
  const didInit = refs.current.selector !== null;

  const [state, setState] = React.useState<T>(
    // We don't use an initialization function to avoid allocations
    (didInit ? null : applySelector(apiRef, selector, args, apiRef.current.instanceId)) as T,
  );

  refs.current.state = state;
  refs.current.equals = equals;
  refs.current.selector = selector;
  const prevArgs = refs.current.args;
  refs.current.args = args;

  if (didInit && !argsEqual(prevArgs, args)) {
    const newState = applySelector(
      apiRef,
      refs.current.selector,
      refs.current.args,
      apiRef.current.instanceId,
    ) as T;
    if (!refs.current.equals(refs.current.state, newState)) {
      refs.current.state = newState;
      setState(newState);
    }
  }

  useEnhancedEffect(() => {
    return apiRef.current.store.subscribe(() => {
      const newState = applySelector(
        apiRef,
        refs.current.selector,
        refs.current.args,
        apiRef.current.instanceId,
      ) as T;
      if (!refs.current.equals(refs.current.state, newState)) {
        refs.current.state = newState;
        setState(newState);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, EMPTY);

  return state;
};

type Primitive = string | number | boolean | null | undefined;

const resolveDeps = <
  Api extends GridApiCommon,
  Args,
  T,
  Deps extends Array<Selector<Api, Args, T> | Primitive>,
>(
  apiRef: RefObject<Api>,
  nextDeps: [
    ...{
      [K in keyof Deps]: Deps[K] extends Selector<Api, Args, T> ? Selector<Api, Args, T> : Deps[K];
    },
  ],
  prevResolvedDeps?: [
    ...{ [K in keyof Deps]: Deps[K] extends Selector<Api, Args, infer R> ? R : Deps[K] },
  ],
) => {
  let didChange = false;
  if (!prevResolvedDeps) {
    didChange = true;
  }
  if (prevResolvedDeps && prevResolvedDeps.length !== nextDeps.length) {
    console.error(
      'The dependency array passed to %s changed size between renders. The ' +
        'order and size of this array must remain constant.\n\n' +
        'Previous: %s\n' +
        'Incoming: %s',
      'useGridStateEffect',
      `Current dependency array size: ${nextDeps.length} args`,
      `Previous dependency array size: ${prevResolvedDeps.length} args`,
    );
  }

  const resolvedDeps = [] as any;
  for (let i = 0; i < nextDeps.length; i++) {
    let nextDep = nextDeps[i];
    if (typeof nextDep === 'function') {
      nextDep = applySelector(apiRef, nextDep, undefined as any, apiRef.current?.instanceId) as any;
    }

    if (!didChange && prevResolvedDeps && !Object.is(nextDep, prevResolvedDeps[i])) {
      didChange = true;
    }

    resolvedDeps.push(nextDep);
  }

  return {
    didChange,
    values: resolvedDeps,
  };
};

export const useGridStateEffect = <
  Api extends GridApiCommon,
  Args,
  T,
  Deps extends Array<Selector<Api, Args, T> | Primitive>,
>(
  apiRef: RefObject<Api>,
  deps: [
    ...{
      [K in keyof Deps]: Deps[K] extends Selector<Api, Args, T> ? Selector<Api, Args, T> : Deps[K];
    },
  ],
  callback: (
    resolvedDeps: [
      ...{ [K in keyof Deps]: Deps[K] extends Selector<Api, Args, infer R> ? R : Deps[K] },
    ],
  ) => void,
) => {
  const depsRef = React.useRef(deps);
  const previousResolvedDeps = useLazyRef<
    [...{ [K in keyof Deps]: Deps[K] extends Selector<Api, Args, infer R> ? R : Deps[K] }],
    undefined
  >(() => resolveDeps(apiRef, deps).values);

  depsRef.current = deps;

  useEnhancedEffect(
    () =>
      apiRef.current.store.subscribe(() => {
        const resolved = resolveDeps(apiRef, depsRef.current, previousResolvedDeps.current);
        if (resolved.didChange) {
          previousResolvedDeps.current = resolved.values;
          callback(resolved.values);
        }
      }),
    EMPTY,
  );
};
