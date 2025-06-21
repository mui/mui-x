import useLazyRef from '@mui/utils/useLazyRef';
import useOnMount from '@mui/utils/useOnMount';
import type { Store } from './Store';

const noop = () => {};

export function useSelectorEffect<State, Value>(
  store: Store<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
): void {
  const instance = useLazyRef(initialize, { store, selector }).current;
  instance.effect = effect;
  useOnMount(instance.onMount);
}

// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize<State, Value>(params?: {
  store: Store<State>;
  selector: (state: State) => Value;
}) {
  const { store, selector } = params!;

  let previousState = selector(store.state);

  const instance = {
    effect: noop as (previous: Value, next: Value) => void,
    dispose: store.subscribe((state) => {
      const nextState = selector(state);
      instance.effect(previousState, nextState);
      previousState = nextState;
    }),
    onMount: () => {
      return () => {
        instance.dispose();
      };
    },
  };
  return instance;
}
