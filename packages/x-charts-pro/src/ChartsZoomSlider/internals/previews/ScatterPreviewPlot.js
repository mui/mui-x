"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterPreviewPlot = ScatterPreviewPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
function ScatterPreviewPlot(_a) {
    var axisId = _a.axisId, x = _a.x, y = _a.y, height = _a.height, width = _a.width;
    var store = (0, internals_1.useStore)();
    var seriesData = (0, hooks_1.useScatterSeriesContext)();
    var xAxes = store.use(internals_1.selectorChartPreviewComputedXAxis, axisId);
    var yAxes = store.use(internals_1.selectorChartPreviewComputedYAxis, axisId);
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var _b = (0, hooks_1.useZAxes)(), zAxes = _b.zAxis, zAxisIds = _b.zAxisIds;
    var defaultZAxisId = zAxisIds[0];
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: seriesOrder.map(function (seriesId) {
            var _a = series[seriesId], id = _a.id, xAxisId = _a.xAxisId, yAxisId = _a.yAxisId, zAxisId = _a.zAxisId, color = _a.color;
            var xAxis = xAxes[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId];
            var yAxis = yAxes[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId];
            // This series is not attached to the current axis, skip it.
            if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.id) !== axisId && (yAxis === null || yAxis === void 0 ? void 0 : yAxis.id) !== axisId) {
                return null;
            }
            var colorGetter = internals_1.scatterSeriesConfig.colorProcessor(series[seriesId], xAxis, yAxis, zAxes[zAxisId !== null && zAxisId !== void 0 ? zAxisId : defaultZAxisId]);
            var xScale = xAxis.scale;
            var yScale = yAxis.scale;
            return ((0, jsx_runtime_1.jsx)(ScatterPreviewItems, { xScale: xScale, yScale: yScale, color: color, colorGetter: colorGetter, series: series[seriesId], x: x, y: y, height: height, width: width }, id));
        }) }));
}
function ScatterPreviewItems(props) {
    var series = props.series, xScale = props.xScale, yScale = props.yScale, color = props.color, colorGetter = props.colorGetter, x = props.x, y = props.y, width = props.width, height = props.height;
    var isPointInside = React.useCallback(function (px, py) { return px >= x && px <= x + width && py >= y && py <= y + height; }, [height, width, x, y]);
    var scatterPlotData = (0, internals_1.useScatterPlotData)(series, xScale, yScale, isPointInside);
    return ((0, jsx_runtime_1.jsx)("g", { "data-series": series.id, children: scatterPlotData.map(function (dataPoint, i) {
            var _a;
            return ((0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterMarker, { dataIndex: dataPoint.dataIndex, color: colorGetter ? colorGetter(i) : color, x: dataPoint.x, y: dataPoint.y, seriesId: series.id, size: series.preview.markerSize, isHighlighted: false, isFaded: false }, (_a = dataPoint.id) !== null && _a !== void 0 ? _a : dataPoint.dataIndex));
        }) }));
}
