import useLazyRef from '@mui/utils/useLazyRef';
import useOnMount from '@mui/utils/useOnMount';
const noop = () => { };
/**
 * An Effect implementation for the Store. This should be used for side-effects only. To
 * compute and store derived state, use `createSelectorMemoized` instead.
 */
export function useStoreEffect(store, selector, effect) {
    const instance = useLazyRef(initialize, { store, selector }).current;
    instance.effect = effect;
    useOnMount(instance.onMount);
}
// `useLazyRef` typings are incorrect, `params` should not be optional
function initialize(params) {
    const { store, selector } = params;
    let previousState = selector(store.state);
    const instance = {
        effect: noop,
        dispose: null,
        // We want a single subscription done right away and cleared on unmount only,
        // but React triggers `useOnMount` multiple times in dev, so we need to manage
        // the subscription anyway.
        subscribe: () => {
            instance.dispose ??= store.subscribe((state) => {
                const nextState = selector(state);
                if (!Object.is(previousState, nextState)) {
                    const prev = previousState;
                    previousState = nextState;
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
