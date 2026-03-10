"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarItemTooltip = exports.useItemTooltip = void 0;
exports.useInternalItemTooltip = useInternalItemTooltip;
var useSeries_1 = require("../hooks/useSeries");
var useChartTooltip_1 = require("../internals/plugins/featurePlugins/useChartTooltip");
var useStore_1 = require("../internals/store/useStore");
var useAxis_1 = require("../hooks/useAxis");
var useZAxis_1 = require("../hooks/useZAxis");
var useChartSeriesConfig_1 = require("../internals/plugins/corePlugins/useChartSeriesConfig");
var isCartesian_1 = require("../internals/isCartesian");
function useInternalItemTooltip() {
    var _a, _b, _c, _d, _e, _f, _g;
    var store = (0, useStore_1.useStore)();
    var identifier = store.use(useChartTooltip_1.selectorChartsTooltipItem);
    var seriesConfig = store.use(useChartSeriesConfig_1.selectorChartSeriesConfig);
    var series = (0, useSeries_1.useSeries)();
    var _h = (0, useAxis_1.useXAxes)(), xAxis = _h.xAxis, xAxisIds = _h.xAxisIds;
    var _j = (0, useAxis_1.useYAxes)(), yAxis = _j.yAxis, yAxisIds = _j.yAxisIds;
    var _k = (0, useZAxis_1.useZAxes)(), zAxis = _k.zAxis, zAxisIds = _k.zAxisIds;
    var _l = (0, useAxis_1.useRotationAxes)(), rotationAxis = _l.rotationAxis, rotationAxisIds = _l.rotationAxisIds;
    if (!identifier) {
        return null;
    }
    var itemSeries = (_a = series[identifier.type]) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (!itemSeries) {
        return null;
    }
    var xAxisId = (0, isCartesian_1.isCartesianSeries)(itemSeries)
        ? ((_b = itemSeries.xAxisId) !== null && _b !== void 0 ? _b : xAxisIds[0])
        : undefined;
    var yAxisId = (0, isCartesian_1.isCartesianSeries)(itemSeries)
        ? ((_c = itemSeries.yAxisId) !== null && _c !== void 0 ? _c : yAxisIds[0])
        : undefined;
    var zAxisId = 'zAxisId' in itemSeries ? ((_d = itemSeries.zAxisId) !== null && _d !== void 0 ? _d : zAxisIds[0]) : zAxisIds[0];
    var rotationAxisId = rotationAxisIds[0];
    var getColor = (_g = (_f = (_e = seriesConfig[itemSeries.type]).colorProcessor) === null || _f === void 0 ? void 0 : _f.call(_e, itemSeries, xAxisId !== undefined ? xAxis[xAxisId] : undefined, yAxisId !== undefined ? yAxis[yAxisId] : undefined, zAxisId !== undefined ? zAxis[zAxisId] : undefined)) !== null && _g !== void 0 ? _g : (function () { return ''; });
    var axesConfig = {};
    if (xAxisId !== undefined) {
        axesConfig.x = xAxis[xAxisId];
    }
    if (yAxisId !== undefined) {
        axesConfig.y = yAxis[yAxisId];
    }
    if (rotationAxisId !== undefined) {
        axesConfig.rotation = rotationAxis[rotationAxisId];
    }
    return seriesConfig[itemSeries.type].tooltipGetter({
        series: itemSeries,
        axesConfig: axesConfig,
        getColor: getColor,
        identifier: identifier,
    });
}
/**
 * Returns a config object when the tooltip contains a single item to display.
 * Some specific charts like radar need more complex structure. Use specific hook like `useRadarItemTooltip` for them.
 * @returns The tooltip item config
 */
var useItemTooltip = function () {
    return useInternalItemTooltip();
};
exports.useItemTooltip = useItemTooltip;
/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
var useRadarItemTooltip = function () {
    return useInternalItemTooltip();
};
exports.useRadarItemTooltip = useRadarItemTooltip;
