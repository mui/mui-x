"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createSelector_1 = require("./createSelector");
describe('createSelectorMemoized', function () {
    it('should return the same selectors for the same cache keys', function () {
        var selector = (0, createSelector_1.createSelectorMemoized)(function () { return []; });
        var apiRef = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        expect(selector(apiRef)).to.equal(selector(apiRef));
    });
    it('should return different selectors for different cache keys', function () {
        var selector = (0, createSelector_1.createSelectorMemoized)(function () { return []; });
        var apiRef1 = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        var apiRef2 = {
            current: { state: {}, instanceId: { id: 1 } },
        };
        expect(selector(apiRef1)).not.to.equal(selector(apiRef2));
    });
    it('should not clear the cache of one selector when another key is passed', function () {
        var selector = (0, createSelector_1.createSelectorMemoized)(function () { return []; });
        var apiRef1 = {
            current: { state: {}, instanceId: { id: 0 } },
        };
        var apiRef2 = {
            current: { state: {}, instanceId: { id: 1 } },
        };
        var value1 = selector(apiRef1);
        selector(apiRef2);
        var value2 = selector(apiRef1);
        expect(value1).to.equal(value2);
    });
});
