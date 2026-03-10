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
var getNextNonEmptySeries_1 = require("./getNextNonEmptySeries");
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
var nullifySeries = function (series, type, id) {
    var _a, _b;
    var _c, _d, _e;
    return __assign(__assign({}, series), (_a = {}, _a[type] = __assign(__assign({}, series[type]), { series: __assign(__assign({}, (_c = series[type]) === null || _c === void 0 ? void 0 : _c.series), (_b = {}, _b[id] = __assign(__assign({}, (_d = series[type]) === null || _d === void 0 ? void 0 : _d.series[id]), { data: (_e = series[type]) === null || _e === void 0 ? void 0 : _e.series[id].data.map(function () { return null; }) }), _b)) }), _a));
};
describe('getNextNonEmptySeries', function () {
    it('should return next series of same type if available', function () {
        expect((0, getNextNonEmptySeries_1.getNextNonEmptySeries)(seriesMultipleTypes, new Set(['line']), 'line', 'a')).to.deep.equal({
            seriesId: 'b',
            type: 'line',
        });
    });
    it('should return different series type if current series is the last one', function () {
        expect((0, getNextNonEmptySeries_1.getNextNonEmptySeries)(seriesMultipleTypes, new Set(['line', 'bar']), 'line', 'b')).to.deep.equal({
            seriesId: 'a',
            type: 'bar',
        });
    });
    it('should return first series of same type if no other series type are available', function () {
        expect((0, getNextNonEmptySeries_1.getNextNonEmptySeries)(seriesSingleType, new Set(['bar']), 'bar', 'b')).to.deep.equal({
            seriesId: 'a',
            type: 'bar',
        });
    });
    it('should not return first series of same type if the series is full of null values', function () {
        expect((0, getNextNonEmptySeries_1.getNextNonEmptySeries)(nullifySeries(seriesSingleType, 'bar', 'a'), new Set(['bar']), 'bar', 'b')).to.deep.equal({
            seriesId: 'b',
            type: 'bar',
        });
    });
    it('should not move focus if no other series are available', function () {
        expect((0, getNextNonEmptySeries_1.getNextNonEmptySeries)(singleSeries, new Set(['bar', 'line']), 'bar', 'a')).to.deep.equal({
            seriesId: 'a',
            type: 'bar',
        });
    });
});
