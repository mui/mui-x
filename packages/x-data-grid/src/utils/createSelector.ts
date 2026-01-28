import type { RefObject } from '@mui/x-internals/types';
import {
  createSelector as baseCreateSelector,
  createSelectorMemoized as baseCreateSelectorMemoized,
  type CreateSelectorFunction,
} from '@mui/x-internals/store';

export interface OutputSelector<State, Args, Result> {
  (apiRef: RefObject<{ state: State } | null>, args?: Args): Result;
}

export const createSelector = ((...args: Function[]) => {
  const baseSelector = baseCreateSelector(...(args as any)) as any;

  const selector = (apiRef: RefObject<any>, a1: unknown, a2: unknown, a3: unknown) =>
    baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);

  return selector;
}) as unknown as CreateSelectorFunction;

export const createSelectorMemoized: CreateSelectorFunction = ((...args: any) => {
  const baseSelector = baseCreateSelectorMemoized(...args) as any;
  const selector = (apiRef: RefObject<any>, a1: unknown, a2: unknown, a3: unknown) =>
    baseSelector(unwrapIfNeeded(apiRef), a1, a2, a3);
  return selector;
}) as unknown as CreateSelectorFunction;

/**
 * Used to create the root selector for a feature. It assumes that the state is already initialized
 * and strips from the types the possibility of `apiRef` being `null`.
 * Users are warned about this in our documentation https://mui.com/x/react-data-grid/state/#direct-selector-access
 */
export const createRootSelector =
  <State, Args, Result>(
    fn: (state: State, args: Args) => Result,
  ): OutputSelector<State, Args, Result> =>
  (apiRef: RefObject<{ state: State } | null>, args?: Args) =>
    fn(unwrapIfNeeded(apiRef), args!);

function unwrapIfNeeded(refOrState: any) {
  if ('current' in refOrState) {
    return refOrState.current.state;
  }
  return refOrState;
}
