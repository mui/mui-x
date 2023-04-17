import * as React from 'react';
import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';
import type { GridCoreApi } from '../models/api/gridCoreApi';
import { buildWarning } from './warning';

type CacheKey = { id: number };

interface CacheContainer {
  cache: WeakMap<CacheKey, Map<any[], any>>;
}

export interface OutputSelector<State, Result> {
  (apiRef: React.MutableRefObject<{ state: State; instanceId: GridCoreApi['instanceId'] }>): Result;
  // TODO v6: make instanceId require
  (state: State, instanceId?: GridCoreApi['instanceId']): Result;
  acceptsApiRef: boolean;
}

type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any
  ? F extends { state: infer F2 }
    ? F2
    : F
  : never;

type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [
  f: infer F,
  ...rest: infer R,
]
  ? StateFromSelector<F> extends StateFromSelectorList<R>
    ? StateFromSelector<F>
    : StateFromSelectorList<R>
  : {};

type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> =
  // Input selectors as a separate array
  | [selectors: [...Selectors], combiner: (...args: SelectorResultArray<Selectors>) => Result]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArray<Selectors>) => Result];

type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Result>(
  ...items: SelectorArgs<Selectors, Result>
) => OutputSelector<StateFromSelectorList<Selectors>, Result>;

const cacheContainer: CacheContainer = { cache: new WeakMap() };

const missingInstanceIdWarning = buildWarning([
  'MUI: A selector was called without passing the instance ID, which may impact the performance of the grid.',
  'To fix, call it with `apiRef`, e.g. `mySelector(apiRef)`, or pass the instance ID explicitly, e.g `mySelector(state, apiRef.current.instanceId)`.',
]);

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = (...selectorArgs: any[]) => {
    const [stateOrApiRef, instanceId] = selectorArgs;
    const isApiRef = !!stateOrApiRef.current;
    const cacheKey = isApiRef ? stateOrApiRef.current.instanceId : instanceId ?? { id: 'default' };
    const state = isApiRef ? stateOrApiRef.current.state : stateOrApiRef;

    if (process.env.NODE_ENV !== 'production') {
      if (cacheKey.id === 'default') {
        missingInstanceIdWarning();
      }
    }

    const { cache } = cacheContainer;

    if (cache.get(cacheKey) && cache.get(cacheKey)?.get(args)) {
      // We pass the cache key because the called selector might have as
      // dependency another selector created with this `createSelector`.
      return cache.get(cacheKey)?.get(args)(state, cacheKey);
    }

    const newSelector = reselectCreateSelector(...args);

    if (!cache.get(cacheKey)) {
      cache.set(cacheKey, new Map());
    }
    cache.get(cacheKey)?.set(args, newSelector);

    return newSelector(state, cacheKey);
  };

  // We use this property to detect if the selector was created with createSelector
  // or it's only a simple function the receives the state and returns part of it.
  selector.acceptsApiRef = true;

  return selector;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_resetCreateSelectorCache = () => {
  cacheContainer.cache = new WeakMap();
};
