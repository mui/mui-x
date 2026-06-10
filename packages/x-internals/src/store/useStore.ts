import * as React from 'react';
/* We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
 * More info: https://github.com/mui/mui-x/issues/18303#issuecomment-2958392341 */
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import reactMajor from '../reactMajor';
import type { ReadonlyStore } from './Store';

/* Some tests fail in R18 with the raw useSyncExternalStore. It may be possible to make it work
 * but for now we only enable it for R19+. */
const canUseRawUseSyncExternalStore = reactMajor >= 19;
const useStoreImplementation = canUseRawUseSyncExternalStore ? useStoreR19 : useStoreLegacy;

export function useStore<State, Value>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Value,
): Value;
export function useStore<State, Value, A1>(
  store: ReadonlyStore<State>,
  selector: (state: State, a1: A1) => Value,
  a1: A1,
): Value;
export function useStore<State, Value, A1, A2>(
  store: ReadonlyStore<State>,
  selector: (state: State, a1: A1, a2: A2) => Value,
  a1: A1,
  a2: A2,
): Value;
export function useStore<State, Value, A1, A2, A3>(
  store: ReadonlyStore<State>,
  selector: (state: State, a1: A1, a2: A2, a3: A3) => Value,
  a1: A1,
  a2: A2,
  a3: A3,
): Value;
export function useStore(
  store: ReadonlyStore<unknown>,
  selector: Function,
  a1?: unknown,
  a2?: unknown,
  a3?: unknown,
): unknown {
  return useStoreImplementation(store, selector, a1, a2, a3);
}

function useStoreR19(
  store: ReadonlyStore<unknown>,
  selector: Function,
  a1?: unknown,
  a2?: unknown,
  a3?: unknown,
): unknown {
  const getSelection = React.useCallback(
    () => selector(store.getSnapshot(), a1, a2, a3),
    [store, selector, a1, a2, a3],
  );

  return useSyncExternalStore(store.subscribe, getSelection, getSelection);
}

function useStoreLegacy(
  store: ReadonlyStore<unknown>,
  selector: Function,
  a1?: unknown,
  a2?: unknown,
  a3?: unknown,
): unknown {
  // React 18 requires the snapshot to be cached: returning a new reference from
  // `getSnapshot` on consecutive calls without an intervening store update would
  // trigger an infinite render loop. We memoize the selection on the snapshot
  // identity, like `useSyncExternalStoreWithSelector` does, without paying for
  // the full `with-selector` module.
  const getSelection = React.useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot: unknown;
    let memoizedSelection: unknown;
    return () => {
      const snapshot = store.getSnapshot();
      if (!hasMemo || !Object.is(memoizedSnapshot, snapshot)) {
        hasMemo = true;
        memoizedSnapshot = snapshot;
        memoizedSelection = selector(snapshot, a1, a2, a3);
      }
      return memoizedSelection;
    };
  }, [store, selector, a1, a2, a3]);

  return useSyncExternalStore(store.subscribe, getSelection, getSelection);
}
