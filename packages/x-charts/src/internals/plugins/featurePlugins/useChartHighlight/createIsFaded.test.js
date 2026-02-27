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
var createIsFaded_1 = require("./createIsFaded");
var seriesId = 'id1';
var dataIndex = 1;
var itemData = {
    seriesId: seriesId,
    dataIndex: dataIndex,
};
describe('createIsFaded', function () {
    it('should return false when no options are set', function () {
        expect((0, createIsFaded_1.createIsFaded)(null, null)(itemData)).to.equal(false);
    });
    describe('faded=series', function () {
        var isFadedSameSeries = (0, createIsFaded_1.createIsFaded)({ fade: 'series' }, itemData);
        it('should return true when input series is same as highlighted', function () {
            expect(isFadedSameSeries(__assign(__assign({}, itemData), { dataIndex: 2 }))).to.equal(true);
        });
        it('should return false when input series is different than highlighted', function () {
            expect(isFadedSameSeries(__assign(__assign({}, itemData), { seriesId: 'id2' }))).to.equal(false);
        });
    });
    describe('faded=global', function () {
        var isFadedGlobal = (0, createIsFaded_1.createIsFaded)({ fade: 'global' }, itemData);
        it('should return false when item is same as highlighted', function () {
            expect(isFadedGlobal(itemData)).to.equal(false);
        });
        it('should return true when item is different than highlighted', function () {
            expect(isFadedGlobal(__assign(__assign({}, itemData), { dataIndex: 2 }))).to.equal(true);
        });
        it('should return true when series is different than highlighted', function () {
            expect(isFadedGlobal(__assign(__assign({}, itemData), { seriesId: 'id2' }))).to.equal(true);
        });
    });
    describe('faded=none', function () {
        var isFadedNone = (0, createIsFaded_1.createIsFaded)({ fade: 'none' }, itemData);
        it('should return false when item is same as highlighted', function () {
            expect(isFadedNone(itemData)).to.equal(false);
        });
    });
});
