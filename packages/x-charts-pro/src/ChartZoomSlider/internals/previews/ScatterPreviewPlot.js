"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterPreviewPlot = ScatterPreviewPlot;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
function ScatterPreviewPlot(_a) {
    var axisId = _a.axisId, x = _a.x, y = _a.y, height = _a.height, width = _a.width;
    var store = (0, internals_1.useStore)();
    var seriesData = (0, hooks_1.useScatterSeriesContext)();
    var xAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedXAxis, [axisId]);
    var yAxes = (0, internals_1.useSelector)(store, internals_1.selectorChartPreviewComputedYAxis, [axisId]);
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var _b = (0, hooks_1.useZAxes)(), zAxes = _b.zAxis, zAxisIds = _b.zAxisIds;
    var defaultZAxisId = zAxisIds[0];
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    return (<React.Fragment>
      {seriesOrder.map(function (seriesId) {
            var _a = series[seriesId], id = _a.id, xAxisId = _a.xAxisId, yAxisId = _a.yAxisId, zAxisId = _a.zAxisId, color = _a.color;
            var colorGetter = internals_1.scatterSeriesConfig.colorProcessor(series[seriesId], xAxes[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId], yAxes[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId], zAxes[zAxisId !== null && zAxisId !== void 0 ? zAxisId : defaultZAxisId]);
            var xScale = xAxes[xAxisId !== null && xAxisId !== void 0 ? xAxisId : defaultXAxisId].scale;
            var yScale = yAxes[yAxisId !== null && yAxisId !== void 0 ? yAxisId : defaultYAxisId].scale;
            return (<ScatterPreviewItems key={id} xScale={xScale} yScale={yScale} color={color} colorGetter={colorGetter} series={series[seriesId]} x={x} y={y} height={height} width={width}/>);
        })}
    </React.Fragment>);
}
function ScatterPreviewItems(props) {
    var series = props.series, xScale = props.xScale, yScale = props.yScale, color = props.color, colorGetter = props.colorGetter, x = props.x, y = props.y, width = props.width, height = props.height;
    var isPointInside = React.useCallback(function (px, py) { return px >= x && px <= x + width && py >= y && py <= y + height; }, [height, width, x, y]);
    var scatterPlotData = (0, internals_1.useScatterPlotData)(series, xScale, yScale, isPointInside);
    return (<g data-series={series.id}>
      {scatterPlotData.map(function (dataPoint, i) {
            var _a;
            return (<ScatterChart_1.ScatterMarker key={(_a = dataPoint.id) !== null && _a !== void 0 ? _a : dataPoint.dataIndex} dataIndex={dataPoint.dataIndex} color={colorGetter ? colorGetter(i) : color} x={dataPoint.x} y={dataPoint.y} seriesId={series.id} size={series.preview.markerSize} isHighlighted={false} isFaded={false}/>);
        })}
    </g>);
}
