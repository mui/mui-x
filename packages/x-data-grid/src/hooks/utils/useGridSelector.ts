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
  // `state` holds the value this hook currently returns.
  // `storeState` remembers which store state that value was computed from.
  // The store creates a new state object on every update, so comparing `storeState`
  // with the current `store.state` allows `updateState` to skip needless selector
  // calls and to catch updates that happened before the hook subscribed to the store.
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
  if (process.env.NODE_ENV !== 'production' && !apiRef.current.state) {
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

  // Why subscribe in an effect instead of during render: a component can render without
  // ever mounting (e.g. when it suspends during hydration). If it subscribed during render,
  // it could receive a store update and call `setState` before being mounted (#17077).
  // Effects only run for mounted components, so subscribing here is safe.
  //
  // Using a layout effect because the store may already have changed
  // between render and mount (e.g. from a child's ref callback or layout effect).
  // `updateState()` picks up such changes, so the corrected value is shown right away instead of in a second frame.
  useEnhancedEffect(() => {
    updateState();
    return apiRef.current.store.subscribe(updateState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, EMPTY);

  return state;
}
