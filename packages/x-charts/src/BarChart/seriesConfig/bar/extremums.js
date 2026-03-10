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
var findMinMax_1 = require("../../../internals/findMinMax");
var createResult = function (data, direction) {
    if (direction === 'x') {
        return { x: data, y: null };
    }
    return { x: null, y: data };
};
var getBaseExtremum = function (params) {
    var _a;
    var axis = params.axis, getFilters = params.getFilters, isDefaultAxis = params.isDefaultAxis;
    var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
        currentAxisId: axis.id,
        isDefaultAxis: isDefaultAxis,
    });
    var data = filter ? (_a = axis.data) === null || _a === void 0 ? void 0 : _a.filter(function (_, i) { return filter({ x: null, y: null }, i); }) : axis.data;
    return (0, findMinMax_1.findMinMax)(data !== null && data !== void 0 ? data : []);
};
var getValueExtremum = function (direction) {
    return function (params) {
        var series = params.series, axis = params.axis, getFilters = params.getFilters, isDefaultAxis = params.isDefaultAxis;
        return Object.keys(series)
            .filter(function (seriesId) {
            var axisId = direction === 'x' ? series[seriesId].xAxisId : series[seriesId].yAxisId;
            return axisId === axis.id || (isDefaultAxis && axisId === undefined);
        })
            .reduce(function (acc, seriesId) {
            var _a;
            var stackedData = series[seriesId].stackedData;
            var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
                currentAxisId: axis.id,
                isDefaultAxis: isDefaultAxis,
                seriesXAxisId: series[seriesId].xAxisId,
                seriesYAxisId: series[seriesId].yAxisId,
            });
            var _b = (_a = stackedData === null || stackedData === void 0 ? void 0 : stackedData.reduce(function (seriesAcc, values, index) {
                if (filter &&
                    (!filter(createResult(values[0], direction), index) ||
                        !filter(createResult(values[1], direction), index))) {
                    return seriesAcc;
                }
                return [Math.min.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[0]], false)), Math.max.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[1]], false))];
            }, [Infinity, -Infinity])) !== null && _a !== void 0 ? _a : [Infinity, -Infinity], seriesMin = _b[0], seriesMax = _b[1];
            return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
        }, [Infinity, -Infinity]);
    };
};
var getExtremumX = function (params) {
    // Notice that bar should be all horizontal or all vertical.
    // Don't think it's a problem for now
    var isHorizontal = Object.keys(params.series).some(function (seriesId) { return params.series[seriesId].layout === 'horizontal'; });
    if (isHorizontal) {
        return getValueExtremum('x')(params);
    }
    return getBaseExtremum(params);
};
exports.getExtremumX = getExtremumX;
var getExtremumY = function (params) {
    var isHorizontal = Object.keys(params.series).some(function (seriesId) { return params.series[seriesId].layout === 'horizontal'; });
    if (isHorizontal) {
        return getBaseExtremum(params);
    }
    return getValueExtremum('y')(params);
};
exports.getExtremumY = getExtremumY;
