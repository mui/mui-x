import useLazyRef from '@mui/utils/useLazyRef';
import useOnMount from '@mui/utils/useOnMount';
import type { ReadonlyStore } from './Store';

const noop = () => {};

/**
 * An Effect implementation for the Store. This should be used for side-effects only. To
 * compute and store derived state, use `createSelectorMemoized` instead.
 *
 * The effect only runs in response to store updates: when the selector changes between
 * renders (e.g. an inline selector closing over new props), the tracked value is realigned
 * silently so that the effect always compares values produced by the same selector.
 */
export function useStoreEffect<State, Value>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
): void {
  const instance = useLazyRef(initialize, { store, selector }).current;
  instance.effect = effect;
  
  if (instance.selector !== selector) {
    instance.selector = selector;
    const selectedValue = selector(store.state);
    if (!Object.is(instance.previousState, selectedValue)) {
      instance.previousState = selectedValue;
    }
  }
  useOnMount(instance.onMount);
}

// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize<State, Value>(params?: {
  store: ReadonlyStore<State>;
  selector: (state: State) => Value;
}) {
  const { store, selector } = params!;

  const instance = {
    effect: noop as (previous: Value, next: Value) => void,
    selector,
    previousState: selector(store.state),
    dispose: null as Function | null,
    // We want a single subscription done right away and cleared on unmount only,
    // but React triggers `useOnMount` multiple times in dev, so we need to manage
    // the subscription anyway.
    subscribe: () => {
      instance.dispose ??= store.subscribe((state) => {
        const nextState = instance.selector(state);
        if (!Object.is(instance.previousState, nextState)) {
          const prev = instance.previousState;
          instance.previousState = nextState;
          instance.effect(prev, nextState);
        }
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
