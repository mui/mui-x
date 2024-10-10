import { lruMemoize, createSelectorCreator, CreateSelectorFunction } from 'reselect';
import { TreeViewAnyPluginSignature, TreeViewState, TreeViewStateCacheKey } from '../models';

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

const cache = new WeakMap<TreeViewStateCacheKey, Map<any[], any>>();

export type TreeViewSelectorWithArgs<TState, TArgs, TResult> = (
  state: TState,
  args: TArgs,
) => TResult;

export type TreeViewRootSelector<
  TMinimalSignatures extends TreeViewAnyPluginSignature[],
  TResult,
> = <TSignatures extends TMinimalSignatures>(state: TreeViewState<TSignatures>) => TResult;

export const createSelector = ((...args: any) => {
  const selector = (state: TreeViewState<any>, selectorArgs: any) => {
    const cacheKey = state.cacheKey;
    const cacheArgsInit = cache.get(cacheKey);
    const cacheArgs = cacheArgsInit ?? new Map();
    if (!cacheArgsInit) {
      cache.set(cacheKey, cacheArgs);
    }

    const cacheFn = cacheArgs.get(args);
    if (cacheFn) {
      return cacheFn(state, selectorArgs);
    }

    const fn = reselectCreateSelector(...args);
    cacheArgs.set(args, fn);

    return fn(state, selectorArgs);
  };

  return selector;
}) as unknown as CreateSelectorFunction;

createSelector.withTypes = () => {
  throw new Error('Not implemented');
};
