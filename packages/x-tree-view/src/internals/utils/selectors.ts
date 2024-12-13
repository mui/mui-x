import { lruMemoize, createSelectorCreator, CreateSelectorFunction } from 'reselect';
import { TreeViewAnyPluginSignature, TreeViewState, TreeViewStateCacheKey } from '../models';

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

const cache = new WeakMap<
  TreeViewStateCacheKey,
  Map<Parameters<typeof reselectCreateSelector>, any>
>();

export type TreeViewRootSelector<TSignature extends TreeViewAnyPluginSignature> = <
  TSignatures extends [TSignature],
>(
  state: TreeViewState<TSignatures>,
) => TSignature['state'][keyof TSignature['state']];

export type TreeViewSelector<TState, TArgs, TResult> = (state: TState, args: TArgs) => TResult;

/**
 * Method wrapping reselect's createSelector to provide caching for tree view instances.
 *
 */
export const createSelector = ((...createSelectorArgs: any) => {
  const selector: TreeViewSelector<TreeViewState<any>, any, any> = (state, selectorArgs) => {
    const cacheKey = state.cacheKey;

    // If there is no cache for the current tree view instance, create one.
    let cacheForCurrentTreeViewInstance = cache.get(cacheKey);
    if (!cacheForCurrentTreeViewInstance) {
      cacheForCurrentTreeViewInstance = new Map();
      cache.set(cacheKey, cacheForCurrentTreeViewInstance);
    }

    // If there is a cached selector, execute it.
    const cachedSelector = cacheForCurrentTreeViewInstance.get(createSelectorArgs);
    if (cachedSelector) {
      return cachedSelector(state, selectorArgs);
    }

    // Otherwise, create a new selector and cache it and execute it.
    const fn = reselectCreateSelector(...createSelectorArgs);
    cacheForCurrentTreeViewInstance.set(createSelectorArgs, fn);

    return fn(state, selectorArgs);
  };

  return selector;
}) as unknown as CreateSelectorFunction;
