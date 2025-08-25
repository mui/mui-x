"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarPreviewPlot = BarPreviewPlot;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var BarChart_1 = require("@mui/x-charts/BarChart");
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
    return (<g>
      {completedData.map(function (_a) {
            var seriesId = _a.seriesId, data = _a.data;
            return (<g key={seriesId}>
          {data.map(function (_a) {
                    var dataIndex = _a.dataIndex, color = _a.color, layout = _a.layout, x = _a.x, xOrigin = _a.xOrigin, y = _a.y, yOrigin = _a.yOrigin, width = _a.width, height = _a.height;
                    return (<BarChart_1.BarElement key={dataIndex} id={seriesId} dataIndex={dataIndex} color={color} skipAnimation layout={layout !== null && layout !== void 0 ? layout : 'vertical'} x={x} xOrigin={xOrigin} y={y} yOrigin={yOrigin} width={width} height={height}/>);
                })}
        </g>);
        })}
    </g>);
}
function useBarPreviewData(axisId, drawingArea) {
    var store = (0, internals_1.useStore)();
    var xAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedXAxis, [axisId]);
    var yAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedYAxis, [axisId]);
    return (0, internals_1.useBarPlotData)(drawingArea, xAxes, yAxes);
}
