"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtremumY = exports.getExtremumX = void 0;
var getExtremumX = function (params) {
    var _a;
    var series = params.series, axis = params.axis, isDefaultAxis = params.isDefaultAxis, getFilters = params.getFilters;
    var min = Infinity;
    var max = -Infinity;
    for (var seriesId in series) {
        if (!Object.hasOwn(series, seriesId)) {
            continue;
        }
        var axisId = series[seriesId].xAxisId;
        if (!(axisId === axis.id || (axisId === undefined && isDefaultAxis))) {
            continue;
        }
        var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
            currentAxisId: axis.id,
            isDefaultAxis: isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
        });
        var seriesData = (_a = series[seriesId].data) !== null && _a !== void 0 ? _a : [];
        for (var i = 0; i < seriesData.length; i += 1) {
            var d = seriesData[i];
            if (filter && !filter(d, i)) {
                continue;
            }
            if (d.x !== null) {
                if (d.x < min) {
                    min = d.x;
                }
                if (d.x > max) {
                    max = d.x;
                }
            }
        }
    }
    return [min, max];
};
exports.getExtremumX = getExtremumX;
var getExtremumY = function (params) {
    var _a;
    var series = params.series, axis = params.axis, isDefaultAxis = params.isDefaultAxis, getFilters = params.getFilters;
    var min = Infinity;
    var max = -Infinity;
    for (var seriesId in series) {
        if (!Object.hasOwn(series, seriesId)) {
            continue;
        }
        var axisId = series[seriesId].yAxisId;
        if (!(axisId === axis.id || (axisId === undefined && isDefaultAxis))) {
            continue;
        }
        var filter = getFilters === null || getFilters === void 0 ? void 0 : getFilters({
            currentAxisId: axis.id,
            isDefaultAxis: isDefaultAxis,
            seriesXAxisId: series[seriesId].xAxisId,
            seriesYAxisId: series[seriesId].yAxisId,
        });
        var seriesData = (_a = series[seriesId].data) !== null && _a !== void 0 ? _a : [];
        for (var i = 0; i < seriesData.length; i += 1) {
            var d = seriesData[i];
            if (filter && !filter(d, i)) {
                continue;
            }
            if (d.y !== null) {
                if (d.y < min) {
                    min = d.y;
                }
                if (d.y > max) {
                    max = d.y;
                }
            }
        }
    }
    return [min, max];
};
exports.getExtremumY = getExtremumY;
