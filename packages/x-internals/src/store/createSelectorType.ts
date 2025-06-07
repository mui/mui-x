import type { Selector } from 'reselect';

export type CreateSelectorFunction = <
  const Args extends any[],
  const Selectors extends ReadonlyArray<Selector<any>>,
  const Combiner extends (...args: readonly [...ReturnTypes<Selectors>, ...Args]) => any,
>(
  ...items: [...Selectors, Combiner]
) => (
  ...args: Selectors['length'] extends 0
    ? MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>
    : [
        StateFromSelectorList<Selectors>,
        ...MergeParams<ReturnTypes<Selectors>, Parameters<Combiner>>,
      ]
) => ReturnType<Combiner>;

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
