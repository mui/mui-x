"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarItemTooltip = exports.useItemTooltip = void 0;
exports.useInternalItemTooltip = useInternalItemTooltip;
var useSeries_1 = require("../hooks/useSeries");
var useChartInteraction_1 = require("../internals/plugins/featurePlugins/useChartInteraction");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
var useAxis_1 = require("../hooks/useAxis");
var useZAxis_1 = require("../hooks/useZAxis");
var useChartSeries_selectors_1 = require("../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors");
function useInternalItemTooltip() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var store = (0, useStore_1.useStore)();
    var identifier = (0, useSelector_1.useSelector)(store, useChartInteraction_1.selectorChartsInteractionItem);
    var seriesConfig = (0, useSelector_1.useSelector)(store, useChartSeries_selectors_1.selectorChartSeriesConfig);
    var series = (0, useSeries_1.useSeries)();
    var _k = (0, useAxis_1.useXAxes)(), xAxis = _k.xAxis, xAxisIds = _k.xAxisIds;
    var _l = (0, useAxis_1.useYAxes)(), yAxis = _l.yAxis, yAxisIds = _l.yAxisIds;
    var _m = (0, useZAxis_1.useZAxes)(), zAxis = _m.zAxis, zAxisIds = _m.zAxisIds;
    var _o = (0, useAxis_1.useRotationAxes)(), rotationAxis = _o.rotationAxis, rotationAxisIds = _o.rotationAxisIds;
    var _p = (0, useAxis_1.useRadiusAxes)(), radiusAxis = _p.radiusAxis, radiusAxisIds = _p.radiusAxisIds;
    var xAxisId = (_a = series.xAxisId) !== null && _a !== void 0 ? _a : xAxisIds[0];
    var yAxisId = (_b = series.yAxisId) !== null && _b !== void 0 ? _b : yAxisIds[0];
    var zAxisId = (_c = series.zAxisId) !== null && _c !== void 0 ? _c : zAxisIds[0];
    var rotationAxisId = (_d = series.rotationAxisId) !== null && _d !== void 0 ? _d : rotationAxisIds[0];
    var radiusAxisId = (_e = series.radiusAxisId) !== null && _e !== void 0 ? _e : radiusAxisIds[0];
    if (!identifier) {
        return null;
    }
    var itemSeries = (_f = series[identifier.type]) === null || _f === void 0 ? void 0 : _f.series[identifier.seriesId];
    if (!itemSeries) {
        return null;
    }
    var getColor = (_j = (_h = (_g = seriesConfig[itemSeries.type]).colorProcessor) === null || _h === void 0 ? void 0 : _h.call(_g, itemSeries, xAxisId && xAxis[xAxisId], yAxisId && yAxis[yAxisId], zAxisId && zAxis[zAxisId])) !== null && _j !== void 0 ? _j : (function () { return ''; });
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
    if (radiusAxisId !== undefined) {
        axesConfig.radius = radiusAxis[radiusAxisId];
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
