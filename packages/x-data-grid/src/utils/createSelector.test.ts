import { RefObject } from '@mui/x-internals/types';
import { expect } from 'chai';
import { createSelectorMemoized, OutputSelector } from './createSelector';
import { GridStateCommunity } from '../models/gridStateCommunity';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

describe('createSelectorMemoized', () => {
  it('should return the same selectors for the same cache keys', () => {
    const selector = createSelectorMemoized([], () => []) as OutputSelector<
      GridStateCommunity,
      any,
      any
    >;
    const apiRef = {
      current: { state: {}, instanceId: { id: 0 } },
    } as RefObject<GridApiCommunity>;

    expect(selector(apiRef)).to.equal(selector(apiRef));
  });

  it('should return different selectors for different cache keys', () => {
    const selector = createSelectorMemoized([], () => []) as OutputSelector<
      GridStateCommunity,
      any,
      any
    >;
    const apiRef1 = {
      current: { state: {}, instanceId: { id: 0 } },
    } as RefObject<GridApiCommunity>;
    const apiRef2 = {
      current: { state: {}, instanceId: { id: 1 } },
    } as RefObject<GridApiCommunity>;

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
    } as RefObject<GridApiCommunity>;
    const apiRef2 = {
      current: { state: {}, instanceId: { id: 1 } },
    } as RefObject<GridApiCommunity>;
    const value1 = selector(apiRef1);
    selector(apiRef2);
    const value2 = selector(apiRef1);
    expect(value1).to.equal(value2);
  });
});
