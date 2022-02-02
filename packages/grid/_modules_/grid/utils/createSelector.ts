import * as React from 'react';
import { createSelector as reselectCreateSelector, Selector, SelectorResultArray } from 'reselect';

export interface OutputSelector<Api extends { state: any; instanceId: string }, Result> {
  (apiRef: React.MutableRefObject<Api>): Result;
  // TODO v6: make instanceId require
  (state: Api['state'], instanceId?: number): Result;
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

const cache: Record<number | string, Map<any[], any>> = {};

let warnedOnce = false;

export const createSelector: CreateSelectorFunction = (...args: any) => {
  const selector = (...selectorArgs: any[]) => {
    const [stateOrApiRef, instanceId] = selectorArgs;
    const isApiRef = !!stateOrApiRef.current;
    const cacheKey = isApiRef ? stateOrApiRef.current.instanceId : instanceId ?? 'default';
    const state = isApiRef ? stateOrApiRef.current.state : stateOrApiRef;

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
