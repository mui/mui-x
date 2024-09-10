import { lruMemoize, createSelectorCreator, SelectorArray, SelectorResultArray } from 'reselect';
import { TreeViewState } from '../models';

type CacheKey = { id: number };

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

const cache = new WeakMap<CacheKey, Map<any[], any>>();

type StateFromSelectors<TSelectors extends readonly any[]> = TSelectors extends readonly [
  s: infer S,
  ...other: infer R,
]
  ? S extends (state: infer State) => any
    ? State & StateFromSelectors<R>
    : {}
  : {};

export type TreeViewSelectorWithArgs<TState, TArgs, TResult> = (
  state: TState,
  args: TArgs,
) => TResult;
export type TreeViewSelectorWithoutArgs<TState, TResult> = (state: TState) => TResult;

type CombinerWithArgs<InputSelectors extends SelectorArray, Args, Result> = (
  ...params: [...resultFuncArgs: SelectorResultArray<InputSelectors>, args: Args]
) => Result;

type CombinerWithoutArgs<InputSelectors extends SelectorArray, Result> = (
  ...resultFuncArgs: SelectorResultArray<InputSelectors>
) => Result;

interface CreateSelectorFunction {
  <State, Result>(
    selector: TreeViewSelectorWithoutArgs<State, Result>,
  ): TreeViewSelectorWithoutArgs<State, Result>;

  <State, Result, Args>(
    selector: TreeViewSelectorWithArgs<State, Args, Result>,
  ): TreeViewSelectorWithArgs<State, Args, Result>;

  <InputSelectors extends SelectorArray, Result>(
    ...createSelectorArgs: [
      ...inputSelectors: InputSelectors,
      combiner: CombinerWithoutArgs<InputSelectors, Result>,
    ]
  ): TreeViewSelectorWithoutArgs<StateFromSelectors<InputSelectors>, Result>;

  <InputSelectors extends SelectorArray, Args, Result>(
    ...createSelectorArgs: [
      ...inputSelectors: InputSelectors,
      combiner: CombinerWithArgs<InputSelectors, Args, Result>,
    ]
  ): TreeViewSelectorWithArgs<StateFromSelectors<InputSelectors>, Args, Result>;
}

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = (state: TreeViewState<any>, selectorArgs: any) => {
    const cacheKey = state.cacheKey;
    const cacheArgsInit = cache.get(cacheKey);
    const cacheArgs = cacheArgsInit ?? new Map();
    const cacheFn = cacheArgs?.get(args);

    if (cacheArgs && cacheFn) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cacheFn(state, selectorArgs, cacheKey);
    }

    const fn = reselectCreateSelector(...args);

    if (!cacheArgsInit) {
      cache.set(cacheKey, cacheArgs);
    }
    cacheArgs.set(args, fn);

    return fn(state, selectorArgs, cacheKey);
  };

  return selector;
};
