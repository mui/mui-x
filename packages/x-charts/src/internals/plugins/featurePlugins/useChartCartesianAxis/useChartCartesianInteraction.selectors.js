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
exports.selectorChartsInteractionAxisTooltip = exports.selectorChartsInteractionTooltipYAxes = exports.selectorChartsInteractionTooltipXAxes = exports.selectorChartsInteractionYAxisValue = exports.selectorChartsInteractionXAxisValue = exports.selectorChartAxisInteraction = exports.selectorChartsInteractionYAxisIndex = exports.selectorChartsInteractionXAxisIndex = exports.selectChartsInteractionAxisIndex = void 0;
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var selectors_1 = require("../../utils/selectors");
var useChartInteraction_selectors_1 = require("../useChartInteraction/useChartInteraction.selectors");
var getAxisValue_1 = require("./getAxisValue");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var optionalGetAxisId = function (_, id) { return id; };
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
exports.selectorChartsInteractionXAxisIndex = (0, selectors_1.createSelector)([useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, optionalGetAxisId], exports.selectChartsInteractionAxisIndex);
exports.selectorChartsInteractionYAxisIndex = (0, selectors_1.createSelector)([useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, optionalGetAxisId], exports.selectChartsInteractionAxisIndex);
exports.selectorChartAxisInteraction = (0, selectors_1.createSelector)([
    useChartInteraction_selectors_1.selectorChartsInteractionPointerX,
    useChartInteraction_selectors_1.selectorChartsInteractionPointerY,
    useChartCartesianAxisRendering_selectors_1.selectorChartXAxis,
    useChartCartesianAxisRendering_selectors_1.selectorChartYAxis,
], function (x, y, xAxis, yAxis) {
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
            return (0, getAxisValue_1.getAxisValue)(axes.axis[id], value, indexes[axisIndex]);
        })
        : (0, getAxisValue_1.getAxisValue)(axes.axis[ids], value, indexes);
}
exports.selectorChartsInteractionXAxisValue = (0, selectors_1.createSelector)([
    useChartInteraction_selectors_1.selectorChartsInteractionPointerX,
    useChartCartesianAxisRendering_selectors_1.selectorChartXAxis,
    exports.selectorChartsInteractionXAxisIndex,
    optionalGetAxisId,
], function (x, xAxes, xIndex, id) {
    if (x === null || xAxes.axisIds.length === 0) {
        return null;
    }
    return valueGetter(x, xAxes, xIndex, id);
});
exports.selectorChartsInteractionYAxisValue = (0, selectors_1.createSelector)([
    useChartInteraction_selectors_1.selectorChartsInteractionPointerY,
    useChartCartesianAxisRendering_selectors_1.selectorChartYAxis,
    exports.selectorChartsInteractionYAxisIndex,
    optionalGetAxisId,
], function (y, yAxes, yIndex, id) {
    if (y === null || yAxes.axisIds.length === 0) {
        return null;
    }
    return valueGetter(y, yAxes, yIndex, id);
});
/**
 * Get x-axis ids and corresponding data index that should be display in the tooltip.
 */
exports.selectorChartsInteractionTooltipXAxes = (0, selectors_1.createSelector)([useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis], function (value, axes) {
    if (value === null) {
        return [];
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
}, {
    memoizeOptions: {
        // Keep the same reference if array content is the same.
        // If possible, avoid this pattern by creating selectors that
        // uses string/number as arguments.
        resultEqualityCheck: isDeepEqual_1.isDeepEqual,
    },
});
/**
 * Get y-axis ids and corresponding data index that should be display in the tooltip.
 */
exports.selectorChartsInteractionTooltipYAxes = (0, selectors_1.createSelector)([useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis], function (value, axes) {
    if (value === null) {
        return [];
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
}, {
    memoizeOptions: {
        // Keep the same reference if array content is the same.
        // If possible, avoid this pattern by creating selectors that
        // uses string/number as arguments.
        resultEqualityCheck: isDeepEqual_1.isDeepEqual,
    },
});
/**
 * Return `true` if the axis tooltip has something to display.
 */
exports.selectorChartsInteractionAxisTooltip = (0, selectors_1.createSelector)([exports.selectorChartsInteractionTooltipXAxes, exports.selectorChartsInteractionTooltipYAxes], function (xTooltip, yTooltip) { return xTooltip.length > 0 || yTooltip.length > 0; });
