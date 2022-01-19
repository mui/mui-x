import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import { GridState } from '../models/gridState';
import { GridApiRef } from '../models/api/gridApiRef';

export interface OutputSelector<Result> {
  (stateOrApiRef: GridApiRef | GridState): Result;
  cache: object;
}

interface CreateSelectorFunction {
  // Input selectors as separate inline arguments
  <Selectors extends ReadonlyArray<Selector<GridState>>, Result>(
    ...items: [...Selectors, (...args: SelectorResultArray<Selectors>) => Result]
  ): OutputSelector<Result>;
  // Input selectors as a separate array
  <Selectors extends ReadonlyArray<Selector<GridState>>, Result>(
    selectors: [...Selectors],
    combiner: (...args: SelectorResultArray<Selectors>) => Result,
  ): OutputSelector<Result>;
}

const cache = {};

function isApiRef(stateOrApiRef: any): stateOrApiRef is GridApiRef {
  return stateOrApiRef.current;
}

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = (stateOrApiRef: GridApiRef | GridState) => {
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
