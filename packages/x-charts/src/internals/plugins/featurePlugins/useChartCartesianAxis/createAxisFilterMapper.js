"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetAxisFilters = void 0;
exports.createDiscreteScaleGetAxisFilter = createDiscreteScaleGetAxisFilter;
exports.createContinuousScaleGetAxisFilter = createContinuousScaleGetAxisFilter;
var isDefined_1 = require("../../../isDefined");
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
function createContinuousScaleGetAxisFilter(domain, zoomStart, zoomEnd, direction, axisData) {
    var min = domain[0].valueOf();
    var max = domain[1].valueOf();
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
