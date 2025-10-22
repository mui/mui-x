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
var useChartKeyboardNavigation_helpers_1 = require("./useChartKeyboardNavigation.helpers");
var barSeries = {
    type: 'bar',
    stackedData: [],
    valueFormatter: function () { return ''; },
    color: '',
    layout: 'horizontal',
    minBarSize: 10,
};
var lineSeries = {
    type: 'line',
    stackedData: [],
    valueFormatter: function () { return ''; },
    color: '',
};
var seriesSingleType = {
    bar: {
        series: {
            b: __assign({ data: [1, 2], id: 'b' }, barSeries),
            a: __assign({ data: [1, 2], id: 'a' }, barSeries),
        },
        seriesOrder: ['a', 'b'],
        stackingGroups: [],
    },
};
var seriesMultipleTypes = {
    bar: {
        series: {
            b: __assign({ data: [1, 2], id: 'b' }, barSeries),
            a: __assign({ data: [1, 2], id: 'a' }, barSeries),
        },
        seriesOrder: ['a', 'b'],
        stackingGroups: [],
    },
    line: {
        series: {
            b: __assign({ data: [1, 2], id: 'b' }, lineSeries),
            a: __assign({ data: [1, 2], id: 'a' }, lineSeries),
        },
        seriesOrder: ['a', 'b'],
        stackingGroups: [],
    },
};
describe('useChartKeyboardNavigation - helpers', function () {
    describe('getPreviousSeriesWithData', function () {
        it('should return previous series of same type if available', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getPreviousSeriesWithData)(seriesMultipleTypes, 'line', 'b')).to.deep.equal({
                seriesId: 'a',
                type: 'line',
            });
        });
        it('should return different series type if current series is the first one', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getPreviousSeriesWithData)(seriesMultipleTypes, 'line', 'a')).to.deep.equal({
                seriesId: 'b',
                type: 'bar',
            });
        });
        it('should return last series of same type if no other series type are available', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getPreviousSeriesWithData)(seriesSingleType, 'bar', 'a')).to.deep.equal({
                seriesId: 'b',
                type: 'bar',
            });
        });
    });
    describe('getNextSeriesWithData', function () {
        it('should return next series of same type if available', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getNextSeriesWithData)(seriesMultipleTypes, 'line', 'a')).to.deep.equal({
                seriesId: 'b',
                type: 'line',
            });
        });
        it('should return different series type if current series is the last one', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getNextSeriesWithData)(seriesMultipleTypes, 'line', 'b')).to.deep.equal({
                seriesId: 'a',
                type: 'bar',
            });
        });
        it('should return first series of same type if no other series type are available', function () {
            expect((0, useChartKeyboardNavigation_helpers_1.getNextSeriesWithData)(seriesSingleType, 'bar', 'b')).to.deep.equal({
                seriesId: 'a',
                type: 'bar',
            });
        });
    });
});
