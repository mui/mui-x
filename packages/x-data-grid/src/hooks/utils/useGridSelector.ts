'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { warnOnce } from '@mui/x-internals/warning';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { GridApiCommon } from '../../models/api/gridApiCommon';
import { useLazyRef } from './useLazyRef';

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

const createRefs = () => ({ state: null, equals: null, selector: null, args: undefined }) as any;

const EMPTY = [] as unknown[];

type Refs<T> = {
  state: T;
  equals: <U = T>(a: U, b: U) => boolean;
  selector: Function;
  args: any;
  subscription: undefined | (() => void);
};

const emptyGetSnapshot = () => null;

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
  }

  const subscribe = React.useCallback(
    () => {
      if (refs.current.subscription) {
        return null;
      }

      refs.current.subscription = apiRef.current.store.subscribe(() => {
        const newState = refs.current.selector(apiRef, refs.current.args) as T;
        if (!refs.current.equals(refs.current.state, newState)) {
          refs.current.state = newState;
          setState(newState);
        }
      });

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    EMPTY,
  );

  const unsubscribe = React.useCallback(() => {
    // Fixes issue in React Strict Mode, where getSnapshot is not called
    if (!refs.current.subscription) {
      subscribe();
    }

    return () => {
      if (refs.current.subscription) {
        refs.current.subscription();
        refs.current.subscription = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, EMPTY);

  useSyncExternalStore(unsubscribe, subscribe, emptyGetSnapshot);

  return state;
}
