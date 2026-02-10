"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAxesTooltip = useAxesTooltip;
var useSeries_1 = require("../hooks/useSeries");
var useColorProcessor_1 = require("../internals/plugins/corePlugins/useChartSeries/useColorProcessor");
var useStore_1 = require("../internals/store/useStore");
var getLabel_1 = require("../internals/getLabel");
var isCartesian_1 = require("../internals/isCartesian");
var utils_1 = require("./utils");
var useAxis_1 = require("../hooks/useAxis");
var useZAxis_1 = require("../hooks/useZAxis");
var useChartCartesianAxis_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var useChartPolarInteraction_selectors_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors");
var isPolar_1 = require("../internals/isPolar");
var useChartVisibilityManager_selectors_1 = require("../internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.selectors");
function defaultAxisTooltipConfig(axis, dataIndex, axisDirection) {
    var _a, _b, _c;
    var axisValue = (_b = (_a = axis.data) === null || _a === void 0 ? void 0 : _a[dataIndex]) !== null && _b !== void 0 ? _b : null;
    var axisFormatter = (_c = axis.valueFormatter) !== null && _c !== void 0 ? _c : (function (v) {
        return axis.scaleType === 'utc' ? (0, utils_1.utcFormatter)(v) : v.toLocaleString();
    });
    var axisFormattedValue = axisFormatter(axisValue, {
        location: 'tooltip',
        scale: axis.scale,
    });
    return {
        axisDirection: axisDirection,
        axisId: axis.id,
        mainAxis: axis,
        dataIndex: dataIndex,
        axisValue: axisValue,
        axisFormattedValue: axisFormattedValue,
        seriesItems: [],
    };
}
/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
function useAxesTooltip(params) {
    var directions = (params !== null && params !== void 0 ? params : {}).directions;
    var defaultXAxis = (0, useAxis_1.useXAxis)();
    var defaultYAxis = (0, useAxis_1.useYAxis)();
    var defaultRotationAxis = (0, useAxis_1.useRotationAxis)();
    var store = (0, useStore_1.useStore)();
    var tooltipXAxes = store.use(useChartCartesianAxis_1.selectorChartsInteractionTooltipXAxes);
    var tooltipYAxes = store.use(useChartCartesianAxis_1.selectorChartsInteractionTooltipYAxes);
    var tooltipRotationAxes = store.use(useChartPolarInteraction_selectors_1.selectorChartsInteractionTooltipRotationAxes);
    var series = (0, useSeries_1.useSeries)();
    var xAxis = (0, useAxis_1.useXAxes)().xAxis;
    var yAxis = (0, useAxis_1.useYAxes)().yAxis;
    var _a = (0, useZAxis_1.useZAxes)(), zAxis = _a.zAxis, zAxisIds = _a.zAxisIds;
    var rotationAxis = (0, useAxis_1.useRotationAxes)().rotationAxis;
    var colorProcessors = (0, useColorProcessor_1.useColorProcessor)();
    var isItemVisible = store.use(useChartVisibilityManager_selectors_1.selectorIsItemVisibleGetter);
    if (tooltipXAxes.length === 0 && tooltipYAxes.length === 0 && tooltipRotationAxes.length === 0) {
        return null;
    }
    var tooltipAxes = [];
    if (directions === undefined || directions.includes('x')) {
        tooltipXAxes.forEach(function (_a) {
            var axisId = _a.axisId, dataIndex = _a.dataIndex;
            tooltipAxes.push(defaultAxisTooltipConfig(xAxis[axisId], dataIndex, 'x'));
        });
    }
    if (directions === undefined || directions.includes('y')) {
        tooltipYAxes.forEach(function (_a) {
            var axisId = _a.axisId, dataIndex = _a.dataIndex;
            tooltipAxes.push(defaultAxisTooltipConfig(yAxis[axisId], dataIndex, 'y'));
        });
    }
    if (directions === undefined || directions.includes('rotation')) {
        tooltipRotationAxes.forEach(function (_a) {
            var axisId = _a.axisId, dataIndex = _a.dataIndex;
            tooltipAxes.push(defaultAxisTooltipConfig(rotationAxis[axisId], dataIndex, 'rotation'));
        });
    }
    Object.keys(series)
        .filter(isCartesian_1.isCartesianSeriesType)
        .forEach(function (seriesType) {
        var seriesOfType = series[seriesType];
        if (!seriesOfType) {
            return [];
        }
        return seriesOfType.seriesOrder.forEach(function (seriesId) {
            var _a, _b, _c, _d, _e, _f;
            var seriesToAdd = seriesOfType.series[seriesId];
            // Skip hidden series
            if (!isItemVisible({ type: seriesType, seriesId: seriesId })) {
                return;
            }
            var providedXAxisId = (_a = seriesToAdd.xAxisId) !== null && _a !== void 0 ? _a : defaultXAxis.id;
            var providedYAxisId = (_b = seriesToAdd.yAxisId) !== null && _b !== void 0 ? _b : defaultYAxis.id;
            var tooltipItemIndex = tooltipAxes.findIndex(function (_a) {
                var axisDirection = _a.axisDirection, axisId = _a.axisId;
                return (axisDirection === 'x' && axisId === providedXAxisId) ||
                    (axisDirection === 'y' && axisId === providedYAxisId);
            });
            // Test if the series uses the default axis
            if (tooltipItemIndex >= 0) {
                var zAxisId = 'zAxisId' in seriesToAdd ? seriesToAdd.zAxisId : zAxisIds[0];
                var dataIndex = tooltipAxes[tooltipItemIndex].dataIndex;
                var color = (_d = (_c = colorProcessors[seriesType]) === null || _c === void 0 ? void 0 : _c.call(colorProcessors, seriesToAdd, xAxis[providedXAxisId], yAxis[providedYAxisId], zAxisId ? zAxis[zAxisId] : undefined)(dataIndex)) !== null && _d !== void 0 ? _d : '';
                var value = (_e = seriesToAdd.data[dataIndex]) !== null && _e !== void 0 ? _e : null;
                var formattedValue = seriesToAdd.valueFormatter(value, {
                    dataIndex: dataIndex,
                });
                var formattedLabel = (_f = (0, getLabel_1.getLabel)(seriesToAdd.label, 'tooltip')) !== null && _f !== void 0 ? _f : null;
                tooltipAxes[tooltipItemIndex].seriesItems.push({
                    seriesId: seriesId,
                    color: color,
                    value: value,
                    formattedValue: formattedValue,
                    formattedLabel: formattedLabel,
                    markType: seriesToAdd.labelMarkType,
                });
            }
        });
    });
    Object.keys(series)
        .filter(isPolar_1.isPolarSeriesType)
        .forEach(function (seriesType) {
        var seriesOfType = series[seriesType];
        if (!seriesOfType) {
            return [];
        }
        return seriesOfType.seriesOrder.forEach(function (seriesId) {
            var _a, _b, _c, _d, _e;
            var seriesToAdd = seriesOfType.series[seriesId];
            // Skip hidden series
            if (!isItemVisible({ type: seriesType, seriesId: seriesId })) {
                return;
            }
            var providedRotationAxisId = 
            // @ts-expect-error Should be fixed when we introduce a polar series with a rotationAxisId
            (_a = seriesToAdd.rotationAxisId) !== null && _a !== void 0 ? _a : defaultRotationAxis === null || defaultRotationAxis === void 0 ? void 0 : defaultRotationAxis.id;
            var tooltipItemIndex = tooltipAxes.findIndex(function (_a) {
                var axisDirection = _a.axisDirection, axisId = _a.axisId;
                return axisDirection === 'rotation' && axisId === providedRotationAxisId;
            });
            // Test if the series uses the default axis
            if (tooltipItemIndex >= 0) {
                var dataIndex = tooltipAxes[tooltipItemIndex].dataIndex;
                var color = (_c = (_b = colorProcessors[seriesType]) === null || _b === void 0 ? void 0 : _b.call(colorProcessors, seriesToAdd)(dataIndex)) !== null && _c !== void 0 ? _c : '';
                var value = (_d = seriesToAdd.data[dataIndex]) !== null && _d !== void 0 ? _d : null;
                var formattedValue = seriesToAdd.valueFormatter(value, {
                    dataIndex: dataIndex,
                });
                var formattedLabel = (_e = (0, getLabel_1.getLabel)(seriesToAdd.label, 'tooltip')) !== null && _e !== void 0 ? _e : null;
                tooltipAxes[tooltipItemIndex].seriesItems.push({
                    seriesId: seriesId,
                    color: color,
                    value: value,
                    formattedValue: formattedValue,
                    formattedLabel: formattedLabel,
                    markType: seriesToAdd.labelMarkType,
                });
            }
        });
    });
    return tooltipAxes;
}
