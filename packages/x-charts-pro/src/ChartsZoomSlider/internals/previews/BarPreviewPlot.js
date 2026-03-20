"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarPreviewPlot = BarPreviewPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var BarChart_1 = require("@mui/x-charts/BarChart");
var internals_2 = require("@mui/x-charts/internals");
function BarPreviewPlot(props) {
    var drawingArea = {
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
        right: props.x + props.width,
        bottom: props.y + props.height,
    };
    var completedData = useBarPreviewData(props.axisId, drawingArea).completedData;
    return ((0, jsx_runtime_1.jsx)("g", { children: completedData.map(function (_a) {
            var seriesId = _a.seriesId, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, data = _a.data;
            return ((0, jsx_runtime_1.jsx)("g", { children: data.map(function (_a) {
                    var dataIndex = _a.dataIndex, color = _a.color, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                    return ((0, jsx_runtime_1.jsx)(BarChart_1.BarElement, { seriesId: seriesId, dataIndex: dataIndex, color: color, skipAnimation: true, layout: layout !== null && layout !== void 0 ? layout : 'vertical', x: x, xOrigin: xOrigin, y: y, yOrigin: yOrigin, width: width, height: height }, dataIndex));
                }) }, seriesId));
        }) }));
}
function useBarPreviewData(axisId, drawingArea) {
    var _a;
    var store = (0, internals_1.useStore)();
    var xAxes = store.use(internals_1.selectorChartPreviewComputedXAxis, axisId);
    var yAxes = store.use(internals_1.selectorChartPreviewComputedYAxis, axisId);
    var seriesData = (_a = (0, hooks_1.useBarSeriesContext)()) !== null && _a !== void 0 ? _a : { series: {}, stackingGroups: [], seriesOrder: [] };
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var chartId = (0, hooks_1.useChartId)();
    var stackingGroups = seriesData.stackingGroups.filter(function (group) {
        return group.ids.some(function (seriesId) {
            var _a, _b;
            var series = seriesData.series[seriesId];
            var xAxisId = (_a = series.xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
            var yAxisId = (_b = series.yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
            return xAxisId === axisId || yAxisId === axisId;
        });
    });
    var filteredSeries = Object.fromEntries(Object.entries(seriesData.series).filter(function (_a) {
        var _b, _c;
        var _ = _a[0], series = _a[1];
        var xAxisId = (_b = series.xAxisId) !== null && _b !== void 0 ? _b : defaultXAxisId;
        var yAxisId = (_c = series.yAxisId) !== null && _c !== void 0 ? _c : defaultYAxisId;
        return xAxisId === axisId || yAxisId === axisId;
    }));
    return (0, internals_2.processBarDataForPlot)(drawingArea, chartId, stackingGroups, filteredSeries, xAxes, yAxes, defaultXAxisId, defaultYAxisId);
}
