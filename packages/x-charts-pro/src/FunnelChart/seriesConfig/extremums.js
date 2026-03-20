"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtremumY = exports.getExtremumX = void 0;
var getValueExtremum = function (direction, isHorizontal, params) {
    var series = params.series, axis = params.axis, isDefaultAxis = params.isDefaultAxis;
    return (Object.keys(series)
        // Keep only series that are associated with the current axis
        .reduce(function (acc, seriesId) {
        var _a, _b;
        var yAxisId = series[seriesId].yAxisId;
        var xAxisId = series[seriesId].xAxisId;
        var dataPoints = series[seriesId].dataPoints;
        if (
        // We skip except if the axis id is not defined for the direction and we are on the default one.
        !(isDefaultAxis && yAxisId === undefined && direction === 'y') &&
            !(isDefaultAxis && xAxisId === undefined && direction === 'x')) {
            return acc;
        }
        if (axis.scaleType === 'band' ||
            (!isHorizontal && direction === 'x') ||
            (isHorizontal && direction === 'y')) {
            var _c = (_b = (_a = dataPoints
                .map(function (v) { return v.map(function (t) { return t[direction]; }); })) === null || _a === void 0 ? void 0 : _a.reduce(function (seriesAcc, values) {
                return [Math.min.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[0]], false)), Math.max.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[1]], false))];
            }, [Infinity, -Infinity])) !== null && _b !== void 0 ? _b : [Infinity, -Infinity], seriesMin_1 = _c[0], seriesMax_1 = _c[1];
            return [Math.min(seriesMin_1, acc[0]), Math.max(seriesMax_1, acc[1])];
        }
        var seriesMin = dataPoints
            .flatMap(function (v) {
            return v.map(function (t) { return t[direction]; }).reduce(function (min, value) { return Math.min(value, min); }, Infinity);
        })
            .reduce(function (sumAcc, value) { return sumAcc + value; }, 0);
        var seriesMax = dataPoints
            .flatMap(function (v) {
            return v.map(function (t) { return t[direction]; }).reduce(function (max, value) { return Math.max(value, max); }, -Infinity);
        })
            .reduce(function (sumAcc, value) { return sumAcc + value; }, 0);
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
    }, [Infinity, -Infinity]));
};
var getExtremumX = function (params) {
    var isHorizontal = Object.keys(params.series).some(function (seriesId) { return params.series[seriesId].layout === 'horizontal'; });
    if (isHorizontal) {
        var _a = getValueExtremum('x', isHorizontal, params), min = _a[0], max = _a[1];
        return [max, min];
    }
    return getValueExtremum('x', isHorizontal, params);
};
exports.getExtremumX = getExtremumX;
var getExtremumY = function (params) {
    var isHorizontal = Object.keys(params.series).some(function (seriesId) { return params.series[seriesId].layout === 'horizontal'; });
    return getValueExtremum('y', isHorizontal, params);
};
exports.getExtremumY = getExtremumY;
