import * as React from 'react';
import { expect } from 'chai';
import { createSelectorMemoized, OutputSelector } from './createSelector';
import { GridStateCommunity } from '../models/gridStateCommunity';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

describe('createSelector', () => {
  describe('state as argument', () => {
    it('should warn if the instance ID is missing', () => {
      const selector = createSelectorMemoized([], () => []);
      const state = {} as GridStateCommunity;
      expect(() => selector(state)).toWarnDev(
        'MUI X: A selector was called without passing the instance ID, which may impact the performance of the grid.',
      );
      expect(() => selector(state, undefined, { id: 0 })).not.toWarnDev();
    });

    it('should fallback to the default behavior when no cache key is provided', () => {
      const selector = createSelectorMemoized([], () => []) as OutputSelector<
        GridStateCommunity,
        any,
        any
      >;
      const state = {} as GridStateCommunity;
      const instanceId = { id: 0 };
      expect(selector(state, undefined, instanceId)).to.equal(
        selector(state, undefined, instanceId),
      );
    });

    it('should clear the cached value when another state is passed', () => {
      const selector = createSelectorMemoized(
        (state: any) => state,
        () => [],
      );
      const state1 = {} as GridStateCommunity;
      const state2 = {} as GridStateCommunity;
      const value1 = selector(state1, undefined, { id: 1 });

      // The default cache has maxSize=1, which forces a recomputation if another state is passed.
      // Since the combiner function returns a new array, the references won't be the same.
      selector(state2, undefined, { id: 1 });

      const value2 = selector(state1, undefined, { id: 1 });
      expect(value1).not.to.equal(value2);
    });
  });

  describe('apiRef as argument', () => {
    it('should return different selectors for different cache keys', () => {
      const selector = createSelectorMemoized([], () => []) as OutputSelector<
        GridStateCommunity,
        any,
        any
      >;
      const apiRef1 = {
        current: { state: {}, instanceId: { id: 0 } },
      } as React.RefObject<GridApiCommunity>;
      const apiRef2 = {
        current: { state: {}, instanceId: { id: 1 } },
      } as React.RefObject<GridApiCommunity>;
      expect(selector(apiRef1)).not.to.equal(selector(apiRef2));
    });

    it('should not clear the cache of one selector when another key is passed', () => {
      const selector = createSelectorMemoized([], () => []) as OutputSelector<
        GridStateCommunity,
        any,
        any
      >;
      const apiRef1 = {
        current: { state: {}, instanceId: { id: 0 } },
      } as React.RefObject<GridApiCommunity>;
      const apiRef2 = {
        current: { state: {}, instanceId: { id: 1 } },
      } as React.RefObject<GridApiCommunity>;
      const value1 = selector(apiRef1);
      selector(apiRef2);
      const value2 = selector(apiRef1);
      expect(value1).to.equal(value2);
    });
  });
});
