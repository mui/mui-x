"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsInteractionPolarAxisTooltip = exports.selectorChartsInteractionTooltipRadiusAxes = exports.selectorChartsInteractionTooltipRotationAxes = exports.selectorChartsInteractionRotationAxisValues = exports.selectorChartsInteractionRotationAxisValue = exports.selectorChartsInteractionRotationAxisIndexes = exports.selectorChartsInteractionRotationAxisIndex = void 0;
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var store_1 = require("@mui/x-internals/store");
var useChartInteraction_selectors_1 = require("../useChartInteraction/useChartInteraction.selectors");
var coordinateTransformation_1 = require("./coordinateTransformation");
var getAxisIndex_1 = require("./getAxisIndex");
var useChartPolarAxis_selectors_1 = require("./useChartPolarAxis.selectors");
var optionalGetAxisId = function (_, id) { return id; };
var optionalGetAxisIds = function (_, ids) { return ids; };
function indexGetter(value, axes, ids) {
    return Array.isArray(ids)
        ? ids.map(function (id) { return (0, getAxisIndex_1.getAxisIndex)(axes.axis[id], value); })
        : (0, getAxisIndex_1.getAxisIndex)(axes.axis[ids], value);
}
/**
 * Helper to get the rotation associated to the interaction coordinate.
 */
var selectorChartsInteractionRotationAngle = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsInteractionPointerX, useChartInteraction_selectors_1.selectorChartsInteractionPointerY, useChartPolarAxis_selectors_1.selectorChartPolarCenter, function (x, y, center) {
    if (x === null || y === null) {
        return null;
    }
    return (0, coordinateTransformation_1.generateSvg2rotation)(center)(x, y);
});
exports.selectorChartsInteractionRotationAxisIndex = (0, store_1.createSelector)(selectorChartsInteractionRotationAngle, useChartPolarAxis_selectors_1.selectorChartRotationAxis, optionalGetAxisId, function (rotation, rotationAxis, id) {
    if (id === void 0) { id = rotationAxis.axisIds[0]; }
    return rotation === null ? null : indexGetter(rotation, rotationAxis, id);
});
exports.selectorChartsInteractionRotationAxisIndexes = (0, store_1.createSelector)(selectorChartsInteractionRotationAngle, useChartPolarAxis_selectors_1.selectorChartRotationAxis, optionalGetAxisIds, function (rotation, rotationAxis, ids) {
    if (ids === void 0) { ids = rotationAxis.axisIds; }
    return rotation === null ? null : indexGetter(rotation, rotationAxis, ids);
});
exports.selectorChartsInteractionRotationAxisValue = (0, store_1.createSelector)(useChartPolarAxis_selectors_1.selectorChartRotationAxis, exports.selectorChartsInteractionRotationAxisIndex, optionalGetAxisId, function (rotationAxis, rotationIndex, id) {
    var _a;
    if (id === void 0) { id = rotationAxis.axisIds[0]; }
    if (rotationIndex === null || rotationIndex === -1 || rotationAxis.axisIds.length === 0) {
        return null;
    }
    var data = (_a = rotationAxis.axis[id]) === null || _a === void 0 ? void 0 : _a.data;
    if (!data) {
        return null;
    }
    return data[rotationIndex];
});
exports.selectorChartsInteractionRotationAxisValues = (0, store_1.createSelector)(useChartPolarAxis_selectors_1.selectorChartRotationAxis, exports.selectorChartsInteractionRotationAxisIndexes, optionalGetAxisIds, function (rotationAxis, rotationIndexes, ids) {
    if (ids === void 0) { ids = rotationAxis.axisIds; }
    if (rotationIndexes === null) {
        return null;
    }
    return ids.map(function (id, axisIndex) {
        var _a;
        var rotationIndex = rotationIndexes[axisIndex];
        if (rotationIndex === -1) {
            return null;
        }
        return (_a = rotationAxis.axis[id].data) === null || _a === void 0 ? void 0 : _a[rotationIndex];
    });
});
/**
 * Get rotation-axis ids and corresponding data index that should be display in the tooltip.
 */
exports.selectorChartsInteractionTooltipRotationAxes = (0, store_1.createSelectorMemoizedWithOptions)({
    memoizeOptions: {
        // Keep the same reference if array content is the same.
        // If possible, avoid this pattern by creating selectors that
        // uses string/number as arguments.
        resultEqualityCheck: isDeepEqual_1.isDeepEqual,
    },
})(exports.selectorChartsInteractionRotationAxisIndexes, useChartPolarAxis_selectors_1.selectorChartRotationAxis, function (indexes, axes) {
    if (indexes === null) {
        return [];
    }
    return axes.axisIds
        .map(function (axisId, axisIndex) { return ({
        axisId: axisId,
        dataIndex: indexes[axisIndex],
    }); })
        .filter(function (_a) {
        var axisId = _a.axisId, dataIndex = _a.dataIndex;
        return axes.axis[axisId].triggerTooltip && dataIndex >= 0;
    });
});
/**
 * Get radius-axis ids and corresponding data index that should be displayed in the tooltip.
 */
var selectorChartsInteractionTooltipRadiusAxes = function () {
    // TODO implement this selector and add it to the `selectorChartsInteractionPolarAxisTooltip`
    return [];
};
exports.selectorChartsInteractionTooltipRadiusAxes = selectorChartsInteractionTooltipRadiusAxes;
/**
 * Return `true` if the axis tooltip has something to display.
 */
exports.selectorChartsInteractionPolarAxisTooltip = (0, store_1.createSelector)(exports.selectorChartsInteractionTooltipRotationAxes, function (rotationTooltip) { return rotationTooltip.length > 0; });
