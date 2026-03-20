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
var store_1 = require("@mui/x-internals/store");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartCartesianInteraction_selectors_1 = require("./useChartCartesianInteraction.selectors");
var useChartKeyboardNavigation_selectors_1 = require("../useChartKeyboardNavigation/useChartKeyboardNavigation.selectors");
var useChartInteraction_selectors_1 = require("../useChartInteraction/useChartInteraction.selectors");
var useChartBrush_1 = require("../useChartBrush");
function getAxisHighlight(lastInteractionUpdate, pointerHighlight, keyboardHighlight) {
    if (lastInteractionUpdate === 'pointer') {
        if (pointerHighlight) {
            return [pointerHighlight];
        }
        if (keyboardHighlight) {
            return [keyboardHighlight];
        }
    }
    if (lastInteractionUpdate === 'keyboard') {
        if (keyboardHighlight) {
            return [keyboardHighlight];
        }
        if (pointerHighlight) {
            return [pointerHighlight];
        }
    }
    return [];
}
var selectorChartControlledCartesianAxisHighlight = function (state) { return state.controlledCartesianAxisHighlight; };
var selectAxisHighlight = function (computedIndex, axis, controlledAxisItems, keyboardAxisItem, lastInteractionUpdate, isBrushSelectionActive) {
    if (isBrushSelectionActive) {
        return [];
    }
    if (controlledAxisItems !== undefined) {
        return controlledAxisItems
            .filter(function (item) { return axis.axis[item.axisId] !== undefined; })
            .map(function (item) { return item; });
    }
    var pointerHighlight = computedIndex !== null && {
        axisId: axis.axisIds[0],
        dataIndex: computedIndex,
    };
    var keyboardHighlight = keyboardAxisItem != null && keyboardAxisItem;
    return getAxisHighlight(lastInteractionUpdate, pointerHighlight, keyboardHighlight);
};
exports.selectorChartsHighlightXAxisIndex = (0, store_1.createSelectorMemoized)(useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisIndex, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, selectorChartControlledCartesianAxisHighlight, useChartKeyboardNavigation_selectors_1.selectorChartsKeyboardXAxisIndex, useChartInteraction_selectors_1.selectorChartsLastInteraction, useChartBrush_1.selectorBrushShouldPreventAxisHighlight, selectAxisHighlight);
exports.selectorChartsHighlightYAxisIndex = (0, store_1.createSelectorMemoized)(useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisIndex, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, selectorChartControlledCartesianAxisHighlight, useChartKeyboardNavigation_selectors_1.selectorChartsKeyboardYAxisIndex, useChartInteraction_selectors_1.selectorChartsLastInteraction, useChartBrush_1.selectorBrushShouldPreventAxisHighlight, selectAxisHighlight);
var selectAxisHighlightWithValue = function (computedIndex, computedValue, axis, controlledAxisItems, keyboardAxisItem, lastInteractionUpdate, isBrushSelectionActive) {
    var _a, _b;
    if (isBrushSelectionActive) {
        return [];
    }
    if (controlledAxisItems !== undefined) {
        return controlledAxisItems
            .map(function (item) {
            var _a, _b;
            return (__assign(__assign({}, item), { value: (_b = (_a = axis.axis[item.axisId]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[item.dataIndex] }));
        })
            .filter(function (_a) {
            var value = _a.value;
            return value !== undefined;
        });
    }
    var pointerHighlight = computedValue != null && {
        axisId: axis.axisIds[0],
        value: computedValue,
    };
    if (pointerHighlight && computedIndex != null) {
        pointerHighlight.dataIndex = computedIndex;
    }
    var keyboardValue = keyboardAxisItem != null &&
        ((_b = (_a = axis.axis[keyboardAxisItem.axisId]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[keyboardAxisItem.dataIndex]);
    var keyboardHighlight = keyboardAxisItem != null &&
        keyboardValue != null && __assign(__assign({}, keyboardAxisItem), { value: keyboardValue });
    return getAxisHighlight(lastInteractionUpdate, pointerHighlight, keyboardHighlight);
};
exports.selectorChartsHighlightXAxisValue = (0, store_1.createSelectorMemoized)(useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisIndex, useChartCartesianInteraction_selectors_1.selectorChartsInteractionXAxisValue, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, selectorChartControlledCartesianAxisHighlight, useChartKeyboardNavigation_selectors_1.selectorChartsKeyboardXAxisIndex, useChartInteraction_selectors_1.selectorChartsLastInteraction, useChartBrush_1.selectorBrushShouldPreventAxisHighlight, selectAxisHighlightWithValue);
exports.selectorChartsHighlightYAxisValue = (0, store_1.createSelectorMemoized)(useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisIndex, useChartCartesianInteraction_selectors_1.selectorChartsInteractionYAxisValue, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, selectorChartControlledCartesianAxisHighlight, useChartKeyboardNavigation_selectors_1.selectorChartsKeyboardYAxisIndex, useChartInteraction_selectors_1.selectorChartsLastInteraction, useChartBrush_1.selectorBrushShouldPreventAxisHighlight, selectAxisHighlightWithValue);
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
exports.selectorChartsHighlightXAxis = (0, store_1.createSelector)(selectorChartControlledCartesianAxisHighlight, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, selectAxis);
exports.selectorChartsHighlightYAxis = (0, store_1.createSelector)(selectorChartControlledCartesianAxisHighlight, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, selectAxis);
