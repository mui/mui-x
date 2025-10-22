"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarAxisHighlight = useRadarAxisHighlight;
var useAxis_1 = require("../../hooks/useAxis");
var useRadarSeries_1 = require("../../hooks/useRadarSeries");
var useScale_1 = require("../../hooks/useScale");
var useSelector_1 = require("../../internals/store/useSelector");
var useStore_1 = require("../../internals/store/useStore");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
var useChartPolarAxis_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis");
var useChartPolarInteraction_selectors_1 = require("../../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors");
function useRadarAxisHighlight() {
    var radarSeries = (0, useRadarSeries_1.useRadarSeries)();
    var rotationScale = (0, useScale_1.useRotationScale)();
    var _a = (0, useAxis_1.useRadiusAxes)(), radiusAxis = _a.radiusAxis, radiusAxisIds = _a.radiusAxisIds;
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var store = (0, useStore_1.useStore)();
    var rotationAxisIndex = (0, useSelector_1.useSelector)(store, useChartPolarInteraction_selectors_1.selectorChartsInteractionRotationAxisIndex);
    var rotationAxisValue = (0, useSelector_1.useSelector)(store, useChartPolarInteraction_selectors_1.selectorChartsInteractionRotationAxisValue);
    var center = (0, useSelector_1.useSelector)(store, useChartPolarAxis_1.selectorChartPolarCenter);
    var highlightedIndex = rotationAxisIndex;
    if (!rotationScale) {
        return null;
    }
    if (highlightedIndex === null || highlightedIndex === -1) {
        return null;
    }
    if (radarSeries === undefined || radarSeries.length === 0) {
        return null;
    }
    var metric = radiusAxisIds[highlightedIndex];
    var radiusScale = radiusAxis[metric].scale;
    var angle = rotationScale(rotationAxisValue);
    var radius = radiusScale.range()[1];
    return {
        center: center,
        radius: radius,
        instance: instance,
        highlightedIndex: highlightedIndex,
        highlightedMetric: metric,
        highlightedAngle: angle,
        series: radarSeries,
        points: radarSeries.map(function (series) {
            var value = series.data[highlightedIndex];
            var r = radiusScale(value);
            var _a = instance.polar2svg(r, angle), x = _a[0], y = _a[1];
            var returnedValue = {
                x: x,
                y: y,
                r: r,
                angle: angle,
                value: value,
            };
            return returnedValue;
        }),
    };
}
