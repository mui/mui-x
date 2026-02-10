"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var highlightStates_1 = require("./highlightStates");
describe('highlightStates', function () {
    var s1 = 's1';
    var s2 = 's2';
    var dataIndex = 5;
    var itemData1 = {
        seriesId: s1,
        dataIndex: dataIndex,
    };
    describe('isSeriesHighlighted', function () {
        var seriesHighlightScope = { highlight: 'series' };
        var itemHighlightScope = { highlight: 'item' };
        var noHighlightScope = { highlight: 'none' };
        it('should only return true when scope.highlight is "series" and item.seriesId matches', function () {
            expect((0, highlightStates_1.isSeriesHighlighted)(seriesHighlightScope, itemData1, s1)).to.equal(true);
            expect((0, highlightStates_1.isSeriesHighlighted)(seriesHighlightScope, itemData1, s2)).to.equal(false);
        });
        it('should return false when scope.highlight is not "series"', function () {
            expect((0, highlightStates_1.isSeriesHighlighted)(itemHighlightScope, itemData1, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesHighlighted)(noHighlightScope, itemData1, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesHighlighted)(null, itemData1, s1)).to.equal(false);
        });
        it('should return false when item is null', function () {
            expect((0, highlightStates_1.isSeriesHighlighted)(seriesHighlightScope, null, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesHighlighted)(null, null, s1)).to.equal(false);
        });
        it('should return false when scope has no highlight property', function () {
            expect((0, highlightStates_1.isSeriesHighlighted)({ fade: 'global' }, itemData1, s1)).to.equal(false);
        });
    });
    describe('isSeriesFaded', function () {
        describe('when series is highlighted', function () {
            it('should return false even if fade conditions are met', function () {
                var scope = { highlight: 'series', fade: 'global' };
                expect((0, highlightStates_1.isSeriesFaded)(scope, itemData1, s1)).to.equal(false);
            });
        });
        describe('when scope.fade is "global"', function () {
            var globalFadeScope = { fade: 'global' };
            it('should return true when item is not null', function () {
                expect((0, highlightStates_1.isSeriesFaded)(globalFadeScope, itemData1, s1)).to.equal(true);
                expect((0, highlightStates_1.isSeriesFaded)(globalFadeScope, itemData1, s2)).to.equal(true);
            });
            it('should return false when item is null', function () {
                expect((0, highlightStates_1.isSeriesFaded)(globalFadeScope, null, s1)).to.equal(false);
                expect((0, highlightStates_1.isSeriesFaded)(globalFadeScope, null, s2)).to.equal(false);
            });
        });
        describe('when scope.fade is "series"', function () {
            var seriesFadeScope = { fade: 'series' };
            it('should only return true when item.seriesId matches seriesId', function () {
                expect((0, highlightStates_1.isSeriesFaded)(seriesFadeScope, itemData1, s1)).to.equal(true);
                expect((0, highlightStates_1.isSeriesFaded)(seriesFadeScope, itemData1, s2)).to.equal(false);
            });
            it('should return false when item is null', function () {
                expect((0, highlightStates_1.isSeriesFaded)(seriesFadeScope, null, s1)).to.equal(false);
                expect((0, highlightStates_1.isSeriesFaded)(seriesFadeScope, null, s2)).to.equal(false);
            });
        });
        it('should return false when scope.fade is "none" or is missing', function () {
            var scope = { fade: 'none' };
            expect((0, highlightStates_1.isSeriesFaded)(scope, itemData1, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)(scope, itemData1, s2)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)({}, itemData1, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)({}, itemData1, s2)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)(null, itemData1, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)(null, itemData1, s2)).to.equal(false);
        });
        it('should return false when scope or item are null', function () {
            var scope = { fade: 'none' };
            expect((0, highlightStates_1.isSeriesFaded)(scope, null, s1)).to.equal(false);
            expect((0, highlightStates_1.isSeriesFaded)(scope, null, s2)).to.equal(false);
        });
    });
    describe('getSeriesHighlightedDataIndex', function () {
        describe('when scope.highlight is "item"', function () {
            var highlightItemScope = { highlight: 'item' };
            it('should only return item.dataIndex when item.seriesId matches', function () {
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(highlightItemScope, itemData1, s1)).to.equal(itemData1.dataIndex);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(highlightItemScope, itemData1, s2)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(highlightItemScope, null, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(highlightItemScope, null, s2)).to.equal(null);
            });
            it('should handle undefined dataIndex', function () {
                var itemWithoutDataIndex = { seriesId: s1 };
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(highlightItemScope, itemWithoutDataIndex, s1)).to.equal(undefined);
            });
        });
        describe('when scope.highlight is not "item"', function () {
            it('should return null when scope.highlight is "series"', function () {
                var scope = { highlight: 'series' };
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s2)).to.equal(null);
            });
            it('should return null when scope.highlight is "none"', function () {
                var scope = { highlight: 'none' };
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s2)).to.equal(null);
            });
        });
        describe('when scope is null', function () {
            it('should return null when scope or item are null', function () {
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(null, itemData1, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(null, itemData1, s2)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)({ highlight: 'series' }, null, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)({ highlight: 'series' }, null, s2)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(null, null, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(null, null, s2)).to.equal(null);
            });
        });
        describe('when scope has no highlight property', function () {
            it('should return null', function () {
                var scope = { fade: 'global' };
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, itemData1, s2)).to.equal(null);
            });
        });
    });
    describe('getSeriesUnfadedDataIndex', function () {
        describe('when scope.fade is not "none"', function () {
            it('should only return item.dataIndex when scope.fade is "global" and item.seriesId matches', function () {
                var scope = { fade: 'global' };
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s1)).to.equal(dataIndex);
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s2)).to.equal(null);
            });
            it('should return item.dataIndex when scope.fade is "series" and item.seriesId matches', function () {
                var scope = { fade: 'series' };
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s1)).to.equal(dataIndex);
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s2)).to.equal(null);
            });
            it('should return null when item is null', function () {
                var scope = { fade: 'global' };
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, null, s1)).to.equal(null);
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, null, s2)).to.equal(null);
            });
            it('should handle undefined dataIndex', function () {
                var scope = { fade: 'global' };
                var itemWithoutDataIndex = { seriesId: s1 };
                expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemWithoutDataIndex, s1)).to.equal(undefined);
            });
        });
        it('should return null when scope.fade is "none"', function () {
            var scope = { fade: 'none' };
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s1)).to.equal(null);
        });
        it('should return null when scope.fade is "series", but an item is highlighted', function () {
            var highlightSeriesScope = {
                highlight: 'series',
                fade: 'series',
            };
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(highlightSeriesScope, itemData1, s1)).to.equal(null);
            var highlightItemScope = {
                highlight: 'item',
                fade: 'series',
            };
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(highlightItemScope, itemData1, s1)).to.equal(null);
        });
        it('should return null when scope or item are null', function () {
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(null, itemData1, s1)).to.equal(null);
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(null, itemData1, s2)).to.equal(null);
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(null, null, s2)).to.equal(null);
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(null, null, s2)).to.equal(null);
        });
        it('should return null when scope has no fade property', function () {
            var scope = { highlight: 'series' };
            expect((0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, itemData1, s1)).to.equal(null);
        });
    });
});
