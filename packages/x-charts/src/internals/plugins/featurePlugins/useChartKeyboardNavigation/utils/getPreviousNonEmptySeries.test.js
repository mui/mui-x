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
var getPreviousNonEmptySeries_1 = require("./getPreviousNonEmptySeries");
var barSeries = {
    type: 'bar',
    stackedData: [],
    visibleStackedData: [],
    valueFormatter: function () { return ''; },
    color: '',
    layout: 'horizontal',
    minBarSize: 10,
    hidden: false,
};
var lineSeries = {
    type: 'line',
    stackedData: [],
    visibleStackedData: [],
    valueFormatter: function () { return ''; },
    color: '',
    hidden: false,
};
var singleSeries = {
    bar: {
        series: {
            a: __assign({ data: [1, 2], id: 'a' }, barSeries),
        },
        seriesOrder: ['a'],
        stackingGroups: [],
    },
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
describe('getPreviousNonEmptySeries', function () {
    it('should return previous series of same type if available', function () {
        expect((0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(seriesMultipleTypes, new Set(['line']), 'line', 'b')).to.deep.equal({
            seriesId: 'a',
            type: 'line',
        });
    });
    it('should return different series type if current series is the first one', function () {
        expect((0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(seriesMultipleTypes, new Set(['bar', 'line']), 'line', 'a')).to.deep.equal({
            seriesId: 'b',
            type: 'bar',
        });
    });
    it('should return last series of same type if no other series type are available', function () {
        expect((0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(seriesSingleType, new Set(['bar']), 'bar', 'a')).to.deep.equal({
            seriesId: 'b',
            type: 'bar',
        });
    });
    it('should not move focus if no other series are available', function () {
        expect((0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(singleSeries, new Set(['bar', 'line']), 'bar', 'a')).to.deep.equal({
            seriesId: 'a',
            type: 'bar',
        });
    });
});
