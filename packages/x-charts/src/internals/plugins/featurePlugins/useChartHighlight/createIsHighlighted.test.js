"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var createIsHighlighted_1 = require("./createIsHighlighted");
var seriesId = 'id1';
var dataIndex = 1;
var itemData = {
    seriesId: seriesId,
    dataIndex: dataIndex,
};
describe('createIsHighlighted', function () {
    it('should return false when no options are set', function () {
        expect((0, createIsHighlighted_1.createIsHighlighted)(null, null)(itemData)).to.equal(false);
    });
    describe('highlighted=series', function () {
        var isHighlightedSameSeries = (0, createIsHighlighted_1.createIsHighlighted)({ highlight: 'series' }, itemData);
        it('should return true when input series is same as highlighted', function () {
            expect(isHighlightedSameSeries(itemData)).to.equal(true);
        });
        it('should return false when input series is different than highlighted', function () {
            expect(isHighlightedSameSeries(__assign(__assign({}, itemData), { seriesId: 'id2' }))).to.equal(false);
        });
        it('should return true when input item is different than highlighted', function () {
            expect(isHighlightedSameSeries(__assign(__assign({}, itemData), { dataIndex: 2 }))).to.equal(true);
        });
    });
    describe('highlighted=item', function () {
        var isHighlightedItem = (0, createIsHighlighted_1.createIsHighlighted)({ highlight: 'item' }, itemData);
        it('should return true when input item is same as highlighted', function () {
            expect(isHighlightedItem(itemData)).to.equal(true);
        });
        it('should return false when input item is different than highlighted', function () {
            expect(isHighlightedItem(__assign(__assign({}, itemData), { dataIndex: 2 }))).to.equal(false);
        });
        it('should return false when input series is different than highlighted', function () {
            expect(isHighlightedItem(__assign(__assign({}, itemData), { seriesId: 'id2' }))).to.equal(false);
        });
    });
    describe('highlighted=none', function () {
        var isHighlightedNone = (0, createIsHighlighted_1.createIsHighlighted)({ highlight: 'none' }, itemData);
        it('should return false', function () {
            expect(isHighlightedNone(itemData)).to.equal(false);
        });
    });
});
