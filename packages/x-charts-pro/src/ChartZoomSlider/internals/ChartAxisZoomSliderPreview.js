"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartAxisZoomSliderPreview = ChartAxisZoomSliderPreview;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var system_1 = require("@mui/system");
var useId_1 = require("@mui/utils/useId");
var useChartProZoom_1 = require("../../internals/plugins/useChartProZoom");
var ChartAxisZoomSliderPreviewContent_1 = require("./ChartAxisZoomSliderPreviewContent");
var PreviewBackgroundRect = (0, styles_1.styled)('rect')(function (_a) {
    var theme = _a.theme;
    return ({
        rx: 4,
        ry: 4,
        stroke: theme.palette.grey[700],
        fill: (0, system_1.alpha)(theme.palette.grey[700], 0.4),
    });
});
function ChartAxisZoomSliderPreview(_a) {
    var axisId = _a.axisId, axisDirection = _a.axisDirection, reverse = _a.reverse, props = __rest(_a, ["axisId", "axisDirection", "reverse"]);
    return (<g {...props}>
      <PreviewRectangles {...props} axisId={axisId} axisDirection={axisDirection}/>
      <rect {...props} fill="transparent" rx={4} ry={4}/>
      <ChartAxisZoomSliderPreviewContent_1.ChartAxisZoomSliderPreviewContent axisId={axisId} {...props}/>
    </g>);
}
function PreviewRectangles(props) {
    var axisId = props.axisId, axisDirection = props.axisDirection;
    var store = (0, internals_1.useStore)();
    var zoomData = (0, internals_1.useSelector)(store, useChartProZoom_1.selectorChartAxisZoomData, [axisId]);
    var zoomOptions = (0, internals_1.useSelector)(store, internals_1.selectorChartAxisZoomOptionsLookup, [axisId]);
    var id = (0, useId_1.default)();
    if (!zoomData) {
        return null;
    }
    var maskId = "zoom-preview-mask-".concat(axisId, "-").concat(id);
    var x;
    var y;
    var width;
    var height;
    var range = zoomOptions.maxEnd - zoomOptions.minStart;
    if (axisDirection === 'x') {
        x = props.x + ((zoomData.start - zoomOptions.minStart) / range) * props.width;
        y = props.y;
        width = ((zoomData.end - zoomData.start) / range) * props.width;
        height = props.height;
    }
    else {
        x = props.x;
        y = props.y + (1 - zoomData.end / range) * props.height;
        width = props.width;
        height = ((zoomData.end - zoomData.start) / range) * props.height;
    }
    return (<React.Fragment>
      <mask id={maskId}>
        <rect x={props.x} y={props.y} width={props.width} height={props.height} fill="white"/>
        <rect x={x} y={y} width={width} height={height} fill="black" rx={4} ry={4}/>
      </mask>
      <PreviewBackgroundRect x={props.x} y={props.y} width={props.width} height={props.height} mask={"url(#".concat(maskId, ")")}/>
    </React.Fragment>);
}
