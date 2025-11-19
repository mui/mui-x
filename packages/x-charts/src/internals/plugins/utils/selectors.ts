import type { Selector } from 'reselect';
import { createSelector as internalCreateSelector } from '@mui/x-internals/store';
import { ChartAnyPluginSignature } from '../models/plugin';
import { ChartState } from '../models/chart';

export type ChartRootSelector<
  TSignature extends ChartAnyPluginSignature,
  T extends keyof TSignature['state'] = keyof TSignature['state'],
> = Selector<ChartState<[TSignature]>, TSignature['state'][T]>;

export type ChartOptionalRootSelector<TSignature extends ChartAnyPluginSignature> = Selector<
  ChartState<[], [TSignature]>,
  TSignature['state'][keyof TSignature['state']] | undefined
>;

type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [
  f: infer F,
  ...other: infer R,
]
  ? StateFromSelector<F> extends StateFromSelectorList<R>
    ? StateFromSelector<F>
    : StateFromSelectorList<R>
  : {};

type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type Fn = (...args: any[]) => any;

type ReturnTypes<FunctionsArray extends readonly Fn[]> = {
  [Index in keyof FunctionsArray]: FunctionsArray[Index] extends FunctionsArray[number]
    ? ReturnType<FunctionsArray[Index]>
    : never;
};

type MergeParams<
  STypes extends readonly unknown[],
  CTypes extends readonly unknown[],
> = STypes['length'] extends 0 ? CTypes : MergeParams<DropFirst<STypes>, DropFirst<CTypes>>;

type DropFirst<T> = T extends [any, ...infer Xs] ? Xs : [];

type SelectorArgs<
  Args extends any[],
  Selectors extends ReadonlyArray<Selector<any>>,
  Combiner extends (...args: readonly [...ReturnTypes<Selectors>, ...Args]) => any,
> = Selectors['length'] extends 0
  ? MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>
  : [
      StateFromSelectorList<Selectors>,
      ...MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>,
    ];

type ChartSelector<
  Args extends any[],
  Selectors extends ReadonlyArray<Selector<any>>,
  Combiner extends (...args: readonly [...ReturnTypes<Selectors>, ...Args]) => any,
> = (...args: SelectorArgs<Args, Selectors, Combiner>) => ReturnType<Combiner>;

/**
 * Method wrapping reselect's createChartSelector to provide caching for chart instances.
 */
export const createSelector = <
  const Args extends any[],
  const Selectors extends ReadonlyArray<Selector<any>>,
  const Combiner extends (...args: readonly [...ReturnTypes<Selectors>, ...Args]) => any,
>(
  inputSelectors: [...Selectors],
  combiner: Combiner,
) =>
  internalCreateSelector<Args, Selectors, Combiner>(...inputSelectors, combiner) as ChartSelector<
    Args,
    Selectors,
    Combiner
  >;
