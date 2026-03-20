"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeBarPreviewPlot = RangeBarPreviewPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var internals_1 = require("@mui/x-charts/internals");
var BarChart_1 = require("@mui/x-charts/BarChart");
var useRangeBarPlotData_1 = require("../../../BarChartPremium/RangeBar/useRangeBarPlotData");
function RangeBarPreviewPlot(props) {
    var drawingArea = {
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
        right: props.x + props.width,
        bottom: props.y + props.height,
    };
    var completedData = useBarPreviewData(props.axisId, drawingArea);
    return ((0, jsx_runtime_1.jsx)("g", { children: completedData.map(function (_a) {
            var seriesId = _a.seriesId, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, data = _a.data;
            return ((0, jsx_runtime_1.jsx)("g", { children: data.map(function (_a) {
                    var dataIndex = _a.dataIndex, color = _a.color, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                    return ((0, jsx_runtime_1.jsx)(BarChart_1.BarElement, { seriesId: seriesId, dataIndex: dataIndex, color: color, skipAnimation: true, layout: layout !== null && layout !== void 0 ? layout : 'vertical', x: x, xOrigin: xOrigin, y: y, yOrigin: yOrigin, width: width, height: height }, dataIndex));
                }) }, seriesId));
        }) }));
}
function useBarPreviewData(axisId, drawingArea) {
    var store = (0, internals_1.useStore)();
    var xAxes = store.use(internals_1.selectorChartPreviewComputedXAxis, axisId);
    var yAxes = store.use(internals_1.selectorChartPreviewComputedYAxis, axisId);
    return (0, useRangeBarPlotData_1.useRangeBarPlotData)(drawingArea, xAxes, yAxes);
}
