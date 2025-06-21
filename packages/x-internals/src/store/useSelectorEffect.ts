import useLazyRef from '@mui/utils/useLazyRef';
import useOnMount from '@mui/utils/useOnMount';
import type { Store } from './Store';

export function useSelectorEffect<State, Value>(
  store: Store<State>,
  selector: (state: State) => Value,
  effect: (previous: Value, next: Value) => void,
): void {
  const ref = useLazyRef(initialize, { store, selector, effect } as any);
  useOnMount(ref.current.onMount);
}

function initialize<State, Value>({
  store,
  selector,
  effect,
}: {
  store: Store<State>;
  selector: (state: State) => Value;
  effect: (previous: Value, next: Value) => void;
}) {
  let previousState = selector(store.state);
  const state = {
    dispose: store.subscribe((state) => {
      const nextState = selector(state);
      effect(previousState, nextState);
      previousState = nextState;
    }),
    onMount: () => {
      return () => {
        state.dispose();
      };
    },
  };
  return state;
}
