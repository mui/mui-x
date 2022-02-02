import { expect } from 'chai';
import { createSelector } from './createSelector';
import { GridState } from '../models/gridState';
import { GridApiRef } from '../models/api/gridApiRef';

describe('createSelector', () => {
  describe('state as argument', () => {
    it('should warn if the instance ID is missing', () => {
      const selector = createSelector([], () => []);
      const state = {} as GridState;
      // @ts-expect-error Add tsconfig.json inside the utils folder
      expect(() => selector(state)).toWarnDev(
        'MUI: A selector was called without passing the instance ID, which may impact the performance of the grid.',
      );
      // @ts-expect-error Add tsconfig.json inside the utils folder
      expect(() => selector(state, 0)).not.toWarnDev();
    });

    it('should fallback to the default behavior when no cache key is provided', () => {
      const selector = createSelector([], () => []);
      const state = {} as GridState;
      const instanceId = 0;
      expect(selector(state, instanceId)).to.equal(selector(state, instanceId));
    });

    it('should clear the cached value when another state is passed', () => {
      const selector = createSelector(
        (state: any) => state,
        () => [],
      );
      const state1 = {} as GridState;
      const state2 = {} as GridState;
      const value1 = selector(state1);

      // The default cache has maxSize=1, which forces a recomputation if another state is passed.
      // Since the combiner function returns a new array, the references won't be the same.
      selector(state2);

      const value2 = selector(state1);
      expect(value1).not.to.equal(value2);
    });
  });

  describe('apiRef as argument', () => {
    it('should return different selectors for different cache keys', () => {
      const selector = createSelector([], () => []);
      const apiRef1 = { current: { state: {}, instanceId: 0 } } as GridApiRef;
      const apiRef2 = { current: { state: {}, instanceId: 1 } } as GridApiRef;
      expect(selector(apiRef1)).not.to.equal(selector(apiRef2));
    });

    it('should not clear the cache of one selector when another key is passed', () => {
      const selector = createSelector([], () => []);
      const apiRef1 = { current: { state: {}, instanceId: 0 } } as GridApiRef;
      const apiRef2 = { current: { state: {}, instanceId: 1 } } as GridApiRef;
      const value1 = selector(apiRef1);
      selector(apiRef2);
      const value2 = selector(apiRef1);
      expect(value1).to.equal(value2);
    });
  });
});
