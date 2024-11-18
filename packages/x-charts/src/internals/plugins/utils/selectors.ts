import { lruMemoize, createSelectorCreator, CreateSelectorFunction } from 'reselect';
import { ChartState, ChartStateCacheKey } from '../models';

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

const cache = new WeakMap<
  ChartStateCacheKey,
  Map<Parameters<typeof reselectCreateSelector>, any>
>();

export type ChartsRootSelector = (state: ChartState) => ChartState[keyof ChartState];

export type ChartsSelector<TState, TArgs, TResult> = (state: TState, args: TArgs) => TResult;

/**
 * Method wrapping reselect's createSelector to provide caching for chart instances.
 *
 */
export const createSelector = ((...createSelectorArgs: any) => {
  const selector: ChartsSelector<ChartState, any, any> = (state, selectorArgs) => {
    const cacheKey = state.cacheKey;

    // If there is no cache for the current chart instance, create one.
    let cacheForCurrentChartInstance = cache.get(cacheKey);
    if (!cacheForCurrentChartInstance) {
      cacheForCurrentChartInstance = new Map();
      cache.set(cacheKey, cacheForCurrentChartInstance);
    }

    // If there is a cached selector, execute it.
    const cachedSelector = cacheForCurrentChartInstance.get(createSelectorArgs);
    if (cachedSelector) {
      return cachedSelector(state, selectorArgs);
    }

    // Otherwise, create a new selector and cache it and execute it.
    const fn = reselectCreateSelector(...createSelectorArgs);
    cacheForCurrentChartInstance.set(createSelectorArgs, fn);

    return fn(state, selectorArgs);
  };

  return selector;
}) as unknown as CreateSelectorFunction;
