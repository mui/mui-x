"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartAxisZoomSliderPreviewContent = ChartAxisZoomSliderPreviewContent;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var LinePreviewPlot_1 = require("./previews/LinePreviewPlot");
var AreaPreviewPlot_1 = require("./previews/AreaPreviewPlot");
var BarPreviewPlot_1 = require("./previews/BarPreviewPlot");
var ScatterPreviewPlot_1 = require("./previews/ScatterPreviewPlot");
function ChartAxisZoomSliderPreviewContent(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var axisId = props.axisId, x = props.x, y = props.y, width = props.width, height = props.height;
    var store = (0, internals_1.useStore)();
    var processedSeries = (0, internals_1.useSelector)(store, internals_1.selectorChartSeriesProcessed);
    var children = [];
    var clipId = "zoom-preview-mask-".concat(axisId);
    var hasLineSeries = ((_c = (_b = (_a = processedSeries.line) === null || _a === void 0 ? void 0 : _a.seriesOrder) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0;
    var hasBarSeries = ((_f = (_e = (_d = processedSeries.bar) === null || _d === void 0 ? void 0 : _d.seriesOrder) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 0;
    var hasScatterSeries = ((_j = (_h = (_g = processedSeries.scatter) === null || _g === void 0 ? void 0 : _g.seriesOrder) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0) > 0;
    if (hasLineSeries) {
        children.push(<AreaPreviewPlot_1.AreaPreviewPlot key="area" axisId={axisId}/>);
    }
    if (hasBarSeries) {
        children.push(<BarPreviewPlot_1.BarPreviewPlot key="bar" {...props}/>);
    }
    if (hasLineSeries) {
        children.push(<LinePreviewPlot_1.LinePreviewPlot key="line" axisId={axisId}/>);
    }
    if (hasScatterSeries) {
        children.push(<ScatterPreviewPlot_1.ScatterPreviewPlot key="scatter" {...props}/>);
    }
    return (<React.Fragment>
      <clipPath id={clipId}>
        <rect x={x} y={y} width={width} height={height}/>
      </clipPath>
      <g clipPath={"url(#".concat(clipId, ")")}>{children}</g>
    </React.Fragment>);
}
