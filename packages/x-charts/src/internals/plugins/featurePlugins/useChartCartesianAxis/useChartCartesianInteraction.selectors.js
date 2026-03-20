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
exports.selectorChartsInteractionYAxisValue = exports.selectorChartsInteractionXAxisValue = exports.selectorChartAxisInteraction = exports.selectorChartsInteractionYAxisIndex = exports.selectorChartsInteractionXAxisIndex = exports.selectChartsInteractionAxisIndex = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartInteraction_selectors_1 = require("../useChartInteraction/useChartInteraction.selectors");
var getAxisValue_1 = require("./getAxisValue");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
function indexGetter(value, axes, ids) {
    if (ids === void 0) { ids = axes.axisIds[0]; }
    return Array.isArray(ids)
        ? ids.map(function (id) { return (0, getAxisValue_1.getAxisIndex)(axes.axis[id], value); })
        : (0, getAxisValue_1.getAxisIndex)(axes.axis[ids], value);
}
var selectChartsInteractionAxisIndex = function (value, axes, id) {
    if (value === null) {
        return null;
    }
    var index = indexGetter(value, axes, id);
    return index === -1 ? null : index;
};
exports.selectChartsInteractionAxisIndex = selectChartsInteractionAxisIndex;
exports.selectorChartsInteractionXAxisIndex = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, exports.selectChartsInteractionAxisIndex);
exports.selectorChartsInteractionYAxisIndex = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, exports.selectChartsInteractionAxisIndex);
exports.selectorChartAxisInteraction = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, function (x, y, xAxis, yAxis) {
    return __spreadArray(__spreadArray([], (x === null
        ? []
        : xAxis.axisIds.map(function (axisId) { return ({ axisId: axisId, dataIndex: indexGetter(x, xAxis, axisId) }); })), true), (y === null
        ? []
        : yAxis.axisIds.map(function (axisId) { return ({ axisId: axisId, dataIndex: indexGetter(y, yAxis, axisId) }); })), true).filter(function (item) { return item.dataIndex !== null && item.dataIndex >= 0; });
});
function valueGetter(value, axes, indexes, ids) {
    if (ids === void 0) { ids = axes.axisIds[0]; }
    return Array.isArray(ids)
        ? ids.map(function (id, axisIndex) {
            var axis = axes.axis[id];
            return (0, getAxisValue_1.getAxisValue)(axis.scale, axis.data, value, indexes[axisIndex]);
        })
        : (0, getAxisValue_1.getAxisValue)(axes.axis[ids].scale, axes.axis[ids].data, value, indexes);
}
exports.selectorChartsInteractionXAxisValue = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, exports.selectorChartsInteractionXAxisIndex, function (x, xAxes, xIndex, id) {
    if (x === null || xAxes.axisIds.length === 0) {
        return null;
    }
    return valueGetter(x, xAxes, xIndex, id);
});
exports.selectorChartsInteractionYAxisValue = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, exports.selectorChartsInteractionYAxisIndex, function (y, yAxes, yIndex, id) {
    if (y === null || yAxes.axisIds.length === 0) {
        return null;
    }
    return valueGetter(y, yAxes, yIndex, id);
});
