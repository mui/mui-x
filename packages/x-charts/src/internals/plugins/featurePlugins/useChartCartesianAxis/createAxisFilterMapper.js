"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetAxisFilters = void 0;
exports.createAxisFilterMapper = createAxisFilterMapper;
exports.createDiscreteScaleGetAxisFilter = createDiscreteScaleGetAxisFilter;
exports.createContinuousScaleGetAxisFilter = createContinuousScaleGetAxisFilter;
var isDefined_1 = require("../../../isDefined");
var getAxisExtremum_1 = require("./getAxisExtremum");
var getScale_1 = require("../../../getScale");
function createAxisFilterMapper(_a) {
    var zoomMap = _a.zoomMap, zoomOptions = _a.zoomOptions, seriesConfig = _a.seriesConfig, formattedSeries = _a.formattedSeries, direction = _a.direction;
    return function (axis, axisIndex) {
        var zoomOption = zoomOptions[axis.id];
        if (!zoomOption || zoomOption.filterMode !== 'discard') {
            return null;
        }
        var zoom = zoomMap === null || zoomMap === void 0 ? void 0 : zoomMap.get(axis.id);
        if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
            // No zoom, or zoom with all data visible
            return null;
        }
        var scaleType = axis.scaleType;
        if (scaleType === 'point' || scaleType === 'band') {
            return createDiscreteScaleGetAxisFilter(axis.data, zoom.start, zoom.end, direction);
        }
        return createContinuousScaleGetAxisFilter(scaleType, (0, getAxisExtremum_1.getAxisExtremum)(axis, direction, seriesConfig, axisIndex, formattedSeries), zoom.start, zoom.end, direction, axis.data);
    };
}
function createDiscreteScaleGetAxisFilter(axisData, zoomStart, zoomEnd, direction) {
    var _a;
    var maxIndex = (_a = axisData === null || axisData === void 0 ? void 0 : axisData.length) !== null && _a !== void 0 ? _a : 0;
    var minVal = Math.floor((zoomStart * maxIndex) / 100);
    var maxVal = Math.ceil((zoomEnd * maxIndex) / 100);
    return function filterAxis(value, dataIndex) {
        var _a;
        var val = (_a = value[direction]) !== null && _a !== void 0 ? _a : axisData === null || axisData === void 0 ? void 0 : axisData[dataIndex];
        if (val == null) {
            // If the value does not exist because of missing data point, or out of range index, we just ignore.
            return true;
        }
        return dataIndex >= minVal && dataIndex < maxVal;
    };
}
function createContinuousScaleGetAxisFilter(scaleType, extrema, zoomStart, zoomEnd, direction, axisData) {
    var _a;
    var min;
    var max;
    _a = (0, getScale_1.getScale)(scaleType !== null && scaleType !== void 0 ? scaleType : 'linear', extrema, [0, 100])
        .nice()
        .domain(), min = _a[0], max = _a[1];
    min = min instanceof Date ? min.getTime() : min;
    max = max instanceof Date ? max.getTime() : max;
    var minVal = min + (zoomStart * (max - min)) / 100;
    var maxVal = min + (zoomEnd * (max - min)) / 100;
    return function filterAxis(value, dataIndex) {
        var _a;
        var val = (_a = value[direction]) !== null && _a !== void 0 ? _a : axisData === null || axisData === void 0 ? void 0 : axisData[dataIndex];
        if (val == null) {
            // If the value does not exist because of missing data point, or out of range index, we just ignore.
            return true;
        }
        return val >= minVal && val <= maxVal;
    };
}
var createGetAxisFilters = function (filters) {
    return function (_a) {
        var currentAxisId = _a.currentAxisId, seriesXAxisId = _a.seriesXAxisId, seriesYAxisId = _a.seriesYAxisId, isDefaultAxis = _a.isDefaultAxis;
        return function (value, dataIndex) {
            var _a, _b, _c;
            var axisId = currentAxisId === seriesXAxisId ? seriesYAxisId : seriesXAxisId;
            if (!axisId || isDefaultAxis) {
                return (_c = (_b = (_a = Object.values(filters !== null && filters !== void 0 ? filters : {}))[0]) === null || _b === void 0 ? void 0 : _b.call(_a, value, dataIndex)) !== null && _c !== void 0 ? _c : true;
            }
            var data = [seriesYAxisId, seriesXAxisId]
                .filter(function (id) { return id !== currentAxisId; })
                .map(function (id) { return filters[id !== null && id !== void 0 ? id : '']; })
                .filter(isDefined_1.isDefined);
            return data.every(function (f) { return f(value, dataIndex); });
        };
    };
};
exports.createGetAxisFilters = createGetAxisFilters;
