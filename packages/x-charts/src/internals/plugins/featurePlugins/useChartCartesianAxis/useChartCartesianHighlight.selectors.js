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
exports.selectorChartsHighlightYAxis = exports.selectorChartsHighlightXAxis = exports.selectorChartsHighlightYAxisValue = exports.selectorChartsHighlightXAxisValue = exports.selectorChartsHighlightYAxisIndex = exports.selectorChartsHighlightXAxisIndex = void 0;
var selectors_1 = require("../../utils/selectors");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartCartesianInteraction_selectors_1 = require("./useChartCartesianInteraction.selectors");
var selectorChartControlledCartesianAxisHighlight = function (state) { return state.controlledCartesianAxisHighlight; };
var selectAxisHighlight = function (computedIndex, axis, axisItems) {
    if (axisItems !== undefined) {
        return axisItems.filter(function (item) { return axis.axis[item.axisId] !== undefined; }).map(function (item) { return item; });
    }
    return computedIndex === null ? [] : [{ axisId: axis.axisIds[0], dataIndex: computedIndex }];
};
exports.selectorChartsHighlightXAxisIndex = (0, selectors_1.createSelector)([
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisIndex,
    useChartCartesianAxisRendering_selectors_1.selectorChartXAxis,
    selectorChartControlledCartesianAxisHighlight,
], selectAxisHighlight);
exports.selectorChartsHighlightYAxisIndex = (0, selectors_1.createSelector)([
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisIndex,
    useChartCartesianAxisRendering_selectors_1.selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
], selectAxisHighlight);
var selectAxisHighlightWithValue = function (computedIndex, computedValue, axis, axisItems) {
    if (axisItems !== undefined) {
        return axisItems
            .map(function (item) {
            var _a, _b;
            return (__assign(__assign({}, item), { value: (_b = (_a = axis.axis[item.axisId]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[item.dataIndex] }));
        })
            .filter(function (_a) {
            var value = _a.value;
            return value !== undefined;
        });
    }
    return computedValue === null
        ? []
        : [{ axisId: axis.axisIds[0], dataIndex: computedIndex, value: computedValue }];
};
exports.selectorChartsHighlightXAxisValue = (0, selectors_1.createSelector)([
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisIndex,
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisValue,
    useChartCartesianAxisRendering_selectors_1.selectorChartXAxis,
    selectorChartControlledCartesianAxisHighlight,
], selectAxisHighlightWithValue);
exports.selectorChartsHighlightYAxisValue = (0, selectors_1.createSelector)([
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisIndex,
    useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisValue,
    useChartCartesianAxisRendering_selectors_1.selectorChartYAxis,
    selectorChartControlledCartesianAxisHighlight,
], selectAxisHighlightWithValue);
/**
 * Get the scale of the axis with highlight if controlled. The default axis otherwise.
 * @param controlledItem The controlled value of highlightedAxis
 * @param axis The axis state after all the processing
 * @returns axis state
 */
var selectAxis = function (axisItems, axis) {
    if (axisItems === undefined) {
        return [axis.axis[axis.axisIds[0]]];
    }
    var filteredAxes = axisItems
        .map(function (item) { var _a; return (_a = axis.axis[item.axisId]) !== null && _a !== void 0 ? _a : null; })
        .filter(function (item) { return item !== null; });
    return filteredAxes;
};
exports.selectorChartsHighlightXAxis = (0, selectors_1.createSelector)([selectorChartControlledCartesianAxisHighlight, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis], selectAxis);
exports.selectorChartsHighlightYAxis = (0, selectors_1.createSelector)([selectorChartControlledCartesianAxisHighlight, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis], selectAxis);
