"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtremumY = exports.getExtremumX = void 0;
var findMinMax_1 = require("../../internals/findMinMax");
var getExtremumX = function (params) {
    var _a;
    var axis = params.axis;
    return (0, findMinMax_1.findMinMax)((_a = axis.data) !== null && _a !== void 0 ? _a : []);
};
exports.getExtremumX = getExtremumX;
function getSeriesExtremums(getValues, data, stackedData, filter) {
    return stackedData.reduce(function (seriesAcc, stackedValue, index) {
        if (data[index] === null) {
            return seriesAcc;
        }
        var _a = getValues(stackedValue), base = _a[0], value = _a[1];
        if (filter &&
            (!filter({ y: base, x: null }, index) || !filter({ y: value, x: null }, index))) {
            return seriesAcc;
        }
        return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
    }, [Infinity, -Infinity]);
}
var getExtremumY = function (params) {
    var series = params.series, axis = params.axis, isDefaultAxis = params.isDefaultAxis, getFilters = params.getFilters;
    return Object.keys(series)
        .filter(function (seriesId) {
        var yAxisId = series[seriesId].yAxisId;
        return yAxisId === axis.id || (isDefaultAxis && yAxisId === undefined);
    })
        .reduce(function (acc, seriesId) {
        var _a = series[seriesId], area = _a.area, stackedData = _a.stackedData, data = _a.data;
        var isArea = area !== undefined;
        var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
            currentAxisId: axis.id,
            isDefaultAxis: isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
        });
        // Since this series is not used to display an area, we do not consider the base (the d[0]).
        var getValues = isArea && axis.scaleType !== 'log' && typeof series[seriesId].baseline !== 'string'
            ? function (d) { return d; }
            : function (d) { return [d[1], d[1]]; };
        var seriesExtremums = getSeriesExtremums(getValues, data, stackedData, filter);
        var seriesMin = seriesExtremums[0], seriesMax = seriesExtremums[1];
        return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
    }, [Infinity, -Infinity]);
};
exports.getExtremumY = getExtremumY;
