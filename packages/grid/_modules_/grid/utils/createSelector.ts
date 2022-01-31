import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import { GridState } from '../models/gridState';
import { GridApiRef } from '../models/api/gridApiRef';

export interface OutputSelector<Result> {
  (apiRef: GridApiRef): Result;
  // TODO v6: make instanceId require
  (state: GridState, instanceId?: number): Result;
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

const cache: Record<number | string, Map<any[], any>> = {};

function isApiRef(stateOrApiRef: any): stateOrApiRef is GridApiRef {
  return stateOrApiRef.current;
}

let warnedOnce = false;

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = (...selectorArgs: any[]) => {
    const [stateOrApiRef, instanceId] = selectorArgs;
    const cacheKey = isApiRef(stateOrApiRef)
      ? stateOrApiRef.current.instanceId
      : instanceId ?? 'default';
    const state = isApiRef(stateOrApiRef) ? stateOrApiRef.current.state : stateOrApiRef;

    if (process.env.NODE_ENV !== 'production') {
      if (!warnedOnce && cacheKey === 'default') {
        console.warn(
          [
            'MUI: A selector was called without passing the instance ID, which may impact the performance of the grid.',
            'To fix, call it with `apiRef`, e.g. `mySelector(apiRef)`, or pass the instance ID explicitly, e.g `mySelector(state, apiRef.current.instanceId)`.',
          ].join('\n'),
        );
        warnedOnce = true;
      }
    }

    if (cache[cacheKey] && cache[cacheKey].get(args)) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cache[cacheKey].get(args)(state, cacheKey);
    }

    const newSelector = reselectCreateSelector(...args);

    if (!cache[cacheKey]) {
      cache[cacheKey] = new Map();
    }
    cache[cacheKey].set(args, newSelector);

    return newSelector(state, cacheKey);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.cache = cache;

  return selector;
};
