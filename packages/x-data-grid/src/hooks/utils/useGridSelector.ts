'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import type { RefObject } from '@mui/x-internals/types';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { warnOnce } from '@mui/x-internals/warning';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateCommunity } from '../../models/gridStateCommunity';
import { useLazyRef } from './useLazyRef';

const defaultCompare = Object.is;
export const objectShallowCompare = fastObjectShallowCompare as (a: unknown, b: unknown) => boolean;
const arrayShallowCompare = (a: any[], b: any[]) => {
  if (a === b) {
    return true;
  }

  return a.length === b.length && a.every((v, i) => v === b[i]);
};

const argsEqual = (prev: any, curr: any) => {
  let fn = Object.is;
  if (curr instanceof Array) {
    fn = arrayShallowCompare;
  } else if (curr instanceof Object) {
    fn = objectShallowCompare;
  }
  return fn(prev, curr);
};

const createRefs = () =>
  ({ state: null, equals: null, selector: null, args: undefined, storeState: null }) as any;

const EMPTY = [] as unknown[];

type Refs<T> = {
  // `state` stores the selected value returned by this hook. `storeState` stores the
  // grid store object that produced it, so the mounted-phase catch-up can detect updates
  // that happened before the subscription was attached without subscribing during render.
  state: T;
  storeState: GridStateCommunity | null;
  equals: <U = T>(a: U, b: U) => boolean;
  selector: Function;
  args: any;
};

export function useGridSelector<Api extends GridApiCommon, T>(
  apiRef: RefObject<Api>,
  selector: (apiRef: RefObject<Api>) => T,
  args?: undefined,
  equals?: <U = T>(a: U, b: U) => boolean,
): T;
export function useGridSelector<Api extends GridApiCommon, T, Args>(
  apiRef: RefObject<Api>,
  selector: (apiRef: RefObject<Api>, a1: Args) => T,
  args: Args,
  equals?: <U = T>(a: U, b: U) => boolean,
): T;
export function useGridSelector<Api extends GridApiCommon, Args, T>(
  apiRef: RefObject<Api>,
  selector: Function,
  args: Args = undefined as Args,
  equals: <U = T>(a: U, b: U) => boolean = defaultCompare,
) {
  if (!apiRef.current.state) {
    warnOnce([
      'MUI X: `useGridSelector` has been called before the initialization of the state.',
      'This hook can only be used inside the context of the grid.',
    ]);
  }

  const refs = useLazyRef<Refs<T>, never>(createRefs);
  const didInit = refs.current.selector !== null;

  const [state, setState] = React.useState<T>(
    // We don't use an initialization function to avoid allocations
    (didInit ? null : selector(apiRef, args)) as T,
  );

  refs.current.state = state;
  if (!didInit) {
    refs.current.storeState = apiRef.current.store.state;
  }
  refs.current.equals = equals;
  refs.current.selector = selector;
  const prevArgs = refs.current.args;
  refs.current.args = args;

  if (didInit && !argsEqual(prevArgs, args)) {
    const newState = refs.current.selector(apiRef, refs.current.args) as T;
    if (!refs.current.equals(refs.current.state, newState)) {
      refs.current.state = newState;
      setState(newState);
    }
    refs.current.storeState = apiRef.current.store.state;
  }

  const updateState = React.useCallback(
    () => {
      const storeState = apiRef.current.store.state;

      if (refs.current.storeState !== storeState) {
        const newState = refs.current.selector(apiRef, refs.current.args) as T;
        refs.current.storeState = storeState;

        if (!refs.current.equals(refs.current.state, newState)) {
          refs.current.state = newState;
          setState(newState);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    EMPTY,
  );

  useEnhancedEffect(() => {
    updateState();
    return apiRef.current.store.subscribe(updateState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, EMPTY);

  return state;
}
