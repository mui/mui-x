"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsTooltipAxisPosition = exports.selectorChartsInteractionAxisTooltip = exports.selectorChartsInteractionTooltipYAxes = exports.selectorChartsInteractionTooltipXAxes = void 0;
var store_1 = require("@mui/x-internals/store");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartInteraction_1 = require("../useChartInteraction");
var getAxisValue_1 = require("./getAxisValue");
var getValueToPositionMapper_1 = require("../../../../hooks/getValueToPositionMapper");
var useChartDimensions_selectors_1 = require("../../corePlugins/useChartDimensions/useChartDimensions.selectors");
var selectorChartControlledCartesianAxisTooltip = function (state) { return state.controlledCartesianAxisTooltip; };
var EMPTY_ARRAY = [];
/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
exports.selectorChartsInteractionTooltipXAxes = (0, store_1.createSelectorMemoizedWithOptions)({
    memoizeOptions: {
        // Keep the same reference if array content is the same.
        // If possible, avoid this pattern by creating selectors that
        // uses string/number as arguments.
        resultEqualityCheck: isDeepEqual_1.isDeepEqual,
    },
})(selectorChartControlledCartesianAxisTooltip, useChartInteraction_1.selectorChartsInteractionPointerX, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, function (controlledValues, value, axes) {
    if (controlledValues !== undefined) {
        if (controlledValues.length === 0) {
            return EMPTY_ARRAY;
        }
        var ids_1 = new Set(axes.axisIds);
        var filteredArray = controlledValues.filter(function (_a) {
            var axisId = _a.axisId;
            return ids_1.has(axisId);
        });
        return filteredArray.length === controlledValues.length ? controlledValues : filteredArray;
    }
    if (value === null) {
        return EMPTY_ARRAY;
    }
    return axes.axisIds
        .filter(function (id) { return axes.axis[id].triggerTooltip; })
        .map(function (axisId) { return ({
        axisId: axisId,
        dataIndex: (0, getAxisValue_1.getAxisIndex)(axes.axis[axisId], value),
    }); })
        .filter(function (_a) {
        var dataIndex = _a.dataIndex;
        return dataIndex >= 0;
    });
});
/**
 * Get y-axis ids and corresponding data index that should be display in the tooltip.
 */
exports.selectorChartsInteractionTooltipYAxes = (0, store_1.createSelectorMemoizedWithOptions)({
    memoizeOptions: {
        // Keep the same reference if array content is the same.
        // If possible, avoid this pattern by creating selectors that
        // uses string/number as arguments.
        resultEqualityCheck: isDeepEqual_1.isDeepEqual,
    },
})(selectorChartControlledCartesianAxisTooltip, useChartInteraction_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, function (controlledValues, value, axes) {
    if (controlledValues !== undefined) {
        if (controlledValues.length === 0) {
            return EMPTY_ARRAY;
        }
        var ids_2 = new Set(axes.axisIds);
        var filteredArray = controlledValues.filter(function (_a) {
            var axisId = _a.axisId;
            return ids_2.has(axisId);
        });
        return filteredArray.length === controlledValues.length ? controlledValues : filteredArray;
    }
    if (value === null) {
        return EMPTY_ARRAY;
    }
    return axes.axisIds
        .filter(function (id) { return axes.axis[id].triggerTooltip; })
        .map(function (axisId) { return ({
        axisId: axisId,
        dataIndex: (0, getAxisValue_1.getAxisIndex)(axes.axis[axisId], value),
    }); })
        .filter(function (_a) {
        var dataIndex = _a.dataIndex;
        return dataIndex >= 0;
    });
});
/**
 * Return `true` if the axis tooltip has something to display.
 */
exports.selectorChartsInteractionAxisTooltip = (0, store_1.createSelector)(exports.selectorChartsInteractionTooltipXAxes, exports.selectorChartsInteractionTooltipYAxes, function (xTooltip, yTooltip) { return xTooltip.length > 0 || yTooltip.length > 0; });
function getCoordinatesFromAxis(identifier, axes) {
    var _a;
    var axis = axes.axis[identifier.axisId];
    if (!axis) {
        return null;
    }
    var value = (_a = axis.data) === null || _a === void 0 ? void 0 : _a[identifier.dataIndex];
    if (value == null) {
        return null;
    }
    var coordinate = (0, getValueToPositionMapper_1.getValueToPositionMapper)(axis.scale)(value);
    if (coordinate === undefined) {
        return null;
    }
    return coordinate;
}
exports.selectorChartsTooltipAxisPosition = (0, store_1.createSelectorMemoized)(exports.selectorChartsInteractionTooltipXAxes, exports.selectorChartsInteractionTooltipYAxes, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, useChartDimensions_selectors_1.selectorChartDrawingArea, function selectorChartsTooltipItemPosition(xAxesIdentifiers, yAxesIdentifiers, xAxes, yAxes, drawingArea, placement) {
    if (xAxesIdentifiers.length === 0 && yAxesIdentifiers.length === 0) {
        return null;
    }
    if (xAxesIdentifiers.length > 0) {
        var x = getCoordinatesFromAxis(xAxesIdentifiers[0], xAxes);
        if (x === null) {
            return null;
        }
        switch (placement) {
            case 'left':
            case 'right':
                return { x: x, y: drawingArea.top + drawingArea.height / 2 };
            case 'bottom':
                return { x: x, y: drawingArea.top + drawingArea.height };
            case 'top':
            default:
                return { x: x, y: drawingArea.top };
        }
    }
    if (yAxesIdentifiers.length > 0) {
        var y = getCoordinatesFromAxis(yAxesIdentifiers[0], yAxes);
        if (y === null) {
            return null;
        }
        switch (placement) {
            case 'right':
                return { x: drawingArea.left + drawingArea.width / 2, y: y };
            case 'bottom':
            case 'top':
                return { x: drawingArea.left + drawingArea.width / 2, y: y };
            case 'left':
            default:
                return { x: drawingArea.left + drawingArea.width / 2, y: y };
        }
    }
    return null;
});
