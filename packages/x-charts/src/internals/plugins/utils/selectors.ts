import {
  lruMemoize,
  createSelectorCreator,
  SelectorArray,
  Combiner,
  Selector,
  GetStateFromSelectors,
  GetParamsFromSelectors,
  CreateSelectorOptions,
} from 'reselect';
import { ChartAnyPluginSignature, ChartState, ChartStateCacheKey } from '../models';

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
});

const cache = new WeakMap<
  ChartStateCacheKey,
  Map<
    [
      inputSelectors: SelectorArray<any>,
      combiner: Combiner<any, any>,
      createSelectorOptions?: Simplify<
        CreateSelectorOptions<
          any, // MemoizeFunction,
          any, // ArgsMemoizeFunction,
          any, // OverrideMemoizeFunction,
          any // OverrideArgsMemoizeFunction
        >
      >,
    ],
    any
  >
>();

export type ChartRootSelector<TSignature extends ChartAnyPluginSignature> = Selector<
  ChartState<[TSignature]>,
  TSignature['state'][keyof TSignature['state']]
>;

export type ChartOptionalRootSelector<TSignature extends ChartAnyPluginSignature> = Selector<
  ChartState<[], [TSignature]>,
  TSignature['state'][keyof TSignature['state']] | undefined
>;

export type ChartsSelector<
  Signatures extends readonly ChartAnyPluginSignature[] = [],
  OptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
  Result = unknown,
  Args extends readonly any[] = [],
> = Selector<ChartState<Signatures, OptionalSignatures>, Result, Args>;

type InterruptRecursion = NonNullable<unknown>;
type AnyFunction = (...args: any[]) => any;

export type Simplify<T> = T extends AnyFunction
  ? T
  : {
      [KeyType in keyof T]: T[KeyType];
    } & NonNullable<unknown>;

/**
 * Method wrapping reselect's createSelector to provide caching for chart instances.
 *
 */
export const createSelector = <InputSelectors extends SelectorArray<any>, Result>(
  ...createSelectorArgs: [
    inputSelectors: [...InputSelectors],
    combiner: Combiner<InputSelectors, Result>,
    createSelectorOptions?: Simplify<
      CreateSelectorOptions<
        any, // MemoizeFunction,
        any, // ArgsMemoizeFunction,
        any, // OverrideMemoizeFunction,
        any // OverrideArgsMemoizeFunction
      >
    >,
  ]
): Selector<
  GetStateFromSelectors<InputSelectors> & { cacheKey: ChartStateCacheKey },
  Result,
  GetParamsFromSelectors<InputSelectors> & InterruptRecursion
> => {
  const selector: Selector<
    GetStateFromSelectors<InputSelectors> & { cacheKey: ChartStateCacheKey },
    Result,
    GetParamsFromSelectors<InputSelectors>
  > = (state, ...selectorArgs) => {
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
      return cachedSelector(state, ...selectorArgs);
    }

    // Otherwise, create a new selector and cache it and execute it.
    const fn = reselectCreateSelector(...createSelectorArgs);
    cacheForCurrentChartInstance.set(createSelectorArgs, fn);

    return fn(state, ...selectorArgs);
  };

  return selector;
};
