import { createSelector as baseCreateSelector, createSelectorMemoized as baseCreateSelectorMemoized, } from '@mui/x-internals/store';
export const createSelector = ((...args) => {
    const baseSelector = baseCreateSelector(...args);
    const selector = (apiRef, a1, a2, a3) => baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);
    return selector;
});
export const createSelectorMemoized = ((...args) => {
    const baseSelector = baseCreateSelectorMemoized(...args);
    const selector = (apiRef, a1, a2, a3) => baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);
    return selector;
});
/**
 * Used to create the root selector for a feature. It assumes that the state is already initialized
 * and strips from the types the possibility of `apiRef` being `null`.
 * Users are warned about this in our documentation https://mui.com/x/react-data-grid/state/#direct-selector-access
 */
export const createRootSelector = (fn) => (apiRef, args) => fn(unwrapIfNeeded(apiRef), args);
function unwrapIfNeeded(refOrState) {
    if ('current' in refOrState) {
        return refOrState.current.state;
    }
    return refOrState;
}
