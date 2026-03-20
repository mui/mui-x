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
var internals_1 = require("@mui/x-charts/internals");
var getBaseExtremum = function (params) {
    var _a;
    var axis = params.axis, getFilters = params.getFilters, isDefaultAxis = params.isDefaultAxis;
    var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
        currentAxisId: axis.id,
        isDefaultAxis: isDefaultAxis,
    });
    var data = filter ? (_a = axis.data) === null || _a === void 0 ? void 0 : _a.filter(function (_, i) { return filter({ x: null, y: null }, i); }) : axis.data;
    return (0, internals_1.findMinMax)(data !== null && data !== void 0 ? data : []);
};
var getValueExtremum = function (params) {
    var series = params.series, axis = params.axis, getFilters = params.getFilters, isDefaultAxis = params.isDefaultAxis;
    return Object.keys(series)
        .filter(function (seriesId) {
        var axisId = series[seriesId].yAxisId;
        return axisId === axis.id || (isDefaultAxis && axisId === undefined);
    })
        .reduce(function (acc, seriesId) {
        var _a;
        var data = series[seriesId].data;
        var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
            currentAxisId: axis.id,
            isDefaultAxis: isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
        });
        var _b = (_a = data === null || data === void 0 ? void 0 : data.reduce(function (seriesAcc, values, index) {
            if (values == null) {
                return seriesAcc;
            }
            if (filter &&
                (!filter({ x: null, y: values[0] }, index) ||
                    !filter({ x: null, y: values[1] }, index) ||
                    !filter({ x: null, y: values[2] }, index) ||
                    !filter({ x: null, y: values[3] }, index))) {
                return seriesAcc;
            }
            return [Math.min.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[0]], false)), Math.max.apply(Math, __spreadArray(__spreadArray([], values, false), [seriesAcc[1]], false))];
        }, [Infinity, -Infinity])) !== null && _a !== void 0 ? _a : [Infinity, -Infinity], seriesMin = _b[0], seriesMax = _b[1];
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
    }, [Infinity, -Infinity]);
};
var getExtremumX = function (params) {
    return getBaseExtremum(params);
};
exports.getExtremumX = getExtremumX;
var getExtremumY = function (params) {
    return getValueExtremum(params);
};
exports.getExtremumY = getExtremumY;
