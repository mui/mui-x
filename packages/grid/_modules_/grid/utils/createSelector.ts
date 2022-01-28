import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import { GridApiRef } from '../models/api/gridApiRef';
import { GridApiCommon } from '../models/api/gridApi';

export interface OutputSelector<State, Result> {
  (stateOrApiRef: GridApiRef | State): Result;
  cache: object;
}

type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> =
  // Input selectors as a separate array
  | [selectors: [...Selectors], combiner: (...args: SelectorResultArray<Selectors>) => Result]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArray<Selectors>) => Result];

type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Result>(
  ...items: SelectorArgs<Selectors, Result>
) => OutputSelector<FirstArg<Selectors[0]>, Result>;

const cache = {};

function isApiRef<GridApi extends GridApiCommon>(
  stateOrApiRef: any,
): stateOrApiRef is GridApiRef<GridApi> {
  return stateOrApiRef.current;
}

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = <GridApi extends GridApiCommon>(
    stateOrApiRef: GridApiRef<GridApi> | GridApi['state'],
  ) => {
    const cacheKey = isApiRef(stateOrApiRef) ? stateOrApiRef.current.instanceId : 'default';
    const state = isApiRef(stateOrApiRef) ? stateOrApiRef.current.state : stateOrApiRef;

    if (cache[cacheKey] && cache[cacheKey][args]) {
      return cache[cacheKey][args](state);
    }

    const newSelector = reselectCreateSelector(...args);

    if (!cache[cacheKey]) {
      cache[cacheKey] = {};
    }
    cache[cacheKey][args] = newSelector;

    return newSelector(state);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.cache = cache;

  return selector;
};
