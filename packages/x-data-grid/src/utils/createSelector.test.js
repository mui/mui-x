import { createSelectorMemoized } from './createSelector';
describe('createSelectorMemoized', () => {
    it('should return the same selectors for the same cache keys', () => {
        const selector = createSelectorMemoized(() => []);
        const apiRef = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        expect(selector(apiRef)).to.equal(selector(apiRef));
    });
    it('should return different selectors for different cache keys', () => {
        const selector = createSelectorMemoized(() => []);
        const apiRef1 = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        const apiRef2 = {
            current: { state: {}, instanceId: { id: 1 } },
        };
        expect(selector(apiRef1)).not.to.equal(selector(apiRef2));
    });
    it('should not clear the cache of one selector when another key is passed', () => {
        const selector = createSelectorMemoized(() => []);
        const apiRef1 = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        const apiRef2 = {
            current: { state: {}, instanceId: { id: 1 } },
        };
        const value1 = selector(apiRef1);
        selector(apiRef2);
        const value2 = selector(apiRef1);
        expect(value1).to.equal(value2);
    });
});
