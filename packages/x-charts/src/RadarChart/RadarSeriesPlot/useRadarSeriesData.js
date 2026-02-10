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
exports.useRadarSeriesData = useRadarSeriesData;
var useScale_1 = require("../../hooks/useScale");
var useRadarSeries_1 = require("../../hooks/useRadarSeries");
var useAxis_1 = require("../../hooks/useAxis");
var useItemHighlightedGetter_1 = require("../../hooks/useItemHighlightedGetter");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
var getSeriesColorFn_1 = require("../../internals/getSeriesColorFn");
/**
 * This hook provides all the data needed to display radar series.
 * @param querySeriesId The id of the series to display
 * @returns
 */
function useRadarSeriesData(querySeriesId) {
    var _a;
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var rotationScale = (0, useScale_1.useRotationScale)();
    var radiusAxis = (0, useAxis_1.useRadiusAxes)().radiusAxis;
    var radarSeries = (0, useRadarSeries_1.useRadarSeries)(querySeriesId === undefined ? undefined : [querySeriesId]);
    var _b = (0, useItemHighlightedGetter_1.useItemHighlightedGetter)(), isItemFaded = _b.isFaded, isItemHighlighted = _b.isHighlighted;
    var metrics = (_a = rotationScale === null || rotationScale === void 0 ? void 0 : rotationScale.domain()) !== null && _a !== void 0 ? _a : [];
    var angles = metrics.map(function (key) { return rotationScale(key); });
    return radarSeries.map(function (series) {
        var seriesId = series.id;
        var isSeriesHighlighted = isItemHighlighted({ seriesId: seriesId });
        var isSeriesFaded = !isSeriesHighlighted && isItemFaded({ seriesId: seriesId });
        var getColor = (0, getSeriesColorFn_1.getSeriesColorFn)(series);
        return __assign(__assign({}, series), { seriesId: series.id, isSeriesHighlighted: isSeriesHighlighted, isSeriesFaded: isSeriesFaded, points: series.data.map(function (value, dataIndex) {
                var highlighted = isItemHighlighted({ seriesId: seriesId, dataIndex: dataIndex });
                var faded = !highlighted && isItemFaded({ seriesId: seriesId, dataIndex: dataIndex });
                var r = radiusAxis[metrics[dataIndex]].scale(value);
                var angle = angles[dataIndex];
                var _a = instance.polar2svg(r, angle), x = _a[0], y = _a[1];
                return {
                    x: x,
                    y: y,
                    isItemHighlighted: highlighted,
                    isItemFaded: faded,
                    dataIndex: dataIndex,
                    value: value,
                    color: getColor({ value: value, dataIndex: dataIndex }),
                };
            }) });
    });
}
