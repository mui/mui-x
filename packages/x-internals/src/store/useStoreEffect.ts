import useLazyRef from '@mui/utils/useLazyRef';
import useOnMount from '@mui/utils/useOnMount';
import type { ReadonlyStore } from './Store';
import { fastObjectShallowCompare } from '../fastObjectShallowCompare';

const noop = () => {};

/**
 * An Effect implementation for the Store. This should be used for side-effects only. To
 * compute and store derived state, use `createSelectorMemoized` instead.
 */
export function useStoreEffect<State, Value>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
): void {
  const instance = useLazyRef(initialize, { store, selector }).current;
  instance.effect = effect;
  useOnMount(instance.onMount);
}

// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize<State, Value>(params?: {
  store: ReadonlyStore<State>;
  selector: (state: State) => Value;
}) {
  const { store, selector } = params!;

  let previousState = selector(store.state);

  const instance = {
    effect: noop as (previous: Value, next: Value) => void,
    dispose: null as Function | null,
    // We want a single subscription done right away and cleared on unmount only,
    // but React triggers `useOnMount` multiple times in dev, so we need to manage
    // the subscription anyway.
    subscribe: () => {
      instance.dispose ??= store.subscribe((state) => {
        const nextState = selector(state);
        if (!argsEqual(previousState, nextState)) {
          instance.effect(previousState, nextState);
        }
        previousState = nextState;
      });
    },
    onMount: () => {
      instance.subscribe();
      return () => {
        instance.dispose?.();
        instance.dispose = null;
      };
    },
  };

  instance.subscribe();

  return instance;
}

const objectShallowCompare = fastObjectShallowCompare as (a: unknown, b: unknown) => boolean;
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
