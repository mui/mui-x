"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartAxisZoomSlider = ChartAxisZoomSlider;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var ChartAxisZoomSliderPreview_1 = require("./ChartAxisZoomSliderPreview");
var constants_1 = require("./constants");
var useChartProZoom_1 = require("../../internals/plugins/useChartProZoom");
var ChartAxisZoomSliderTrack_1 = require("./ChartAxisZoomSliderTrack");
var ChartAxisZoomSliderActiveTrack_1 = require("./ChartAxisZoomSliderActiveTrack");
/**
 * Renders the zoom slider for a specific axis.
 * @internal
 */
function ChartAxisZoomSlider(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var axisDirection = _a.axisDirection, axisId = _a.axisId;
    var store = (0, internals_1.useStore)();
    var drawingArea = (0, internals_1.useDrawingArea)();
    var zoomData = (0, internals_1.useSelector)(store, useChartProZoom_1.selectorChartAxisZoomData, [axisId]);
    var zoomOptions = (0, internals_1.useSelector)(store, internals_1.selectorChartAxisZoomOptionsLookup, [axisId]);
    var _m = React.useState(false), showTooltip = _m[0], setShowTooltip = _m[1];
    var xAxis = (0, hooks_1.useXAxes)().xAxis;
    var yAxis = (0, hooks_1.useYAxes)().yAxis;
    var showPreview = zoomOptions.slider.preview;
    if (!zoomData) {
        return null;
    }
    var x;
    var y;
    var reverse;
    var axisPosition;
    var tooltipConditions;
    var sliderSize = showPreview ? internals_1.ZOOM_SLIDER_PREVIEW_SIZE : constants_1.ZOOM_SLIDER_SIZE;
    if (axisDirection === 'x') {
        var axis = xAxis[axisId];
        if (!axis || axis.position === 'none') {
            return null;
        }
        var axisSize = axis.height;
        x = drawingArea.left;
        y =
            axis.position === 'bottom'
                ? drawingArea.top + drawingArea.height + axis.offset + axisSize + internals_1.ZOOM_SLIDER_MARGIN
                : drawingArea.top - axis.offset - axisSize - sliderSize - internals_1.ZOOM_SLIDER_MARGIN;
        reverse = (_b = axis.reverse) !== null && _b !== void 0 ? _b : false;
        axisPosition = (_c = axis.position) !== null && _c !== void 0 ? _c : 'bottom';
        tooltipConditions = (_f = (_e = (_d = axis.zoom) === null || _d === void 0 ? void 0 : _d.slider) === null || _e === void 0 ? void 0 : _e.showTooltip) !== null && _f !== void 0 ? _f : internals_1.DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP;
    }
    else {
        var axis = yAxis[axisId];
        if (!axis || axis.position === 'none') {
            return null;
        }
        var axisSize = axis.width;
        x =
            axis.position === 'right'
                ? drawingArea.left + drawingArea.width + axis.offset + axisSize + internals_1.ZOOM_SLIDER_MARGIN
                : drawingArea.left - axis.offset - axisSize - sliderSize - internals_1.ZOOM_SLIDER_MARGIN;
        y = drawingArea.top;
        reverse = (_g = axis.reverse) !== null && _g !== void 0 ? _g : false;
        axisPosition = (_h = axis.position) !== null && _h !== void 0 ? _h : 'left';
        tooltipConditions = (_l = (_k = (_j = axis.zoom) === null || _j === void 0 ? void 0 : _j.slider) === null || _k === void 0 ? void 0 : _k.showTooltip) !== null && _l !== void 0 ? _l : internals_1.DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP;
    }
    var backgroundRectOffset = (sliderSize - constants_1.ZOOM_SLIDER_TRACK_SIZE) / 2;
    var track = showPreview ? (<ChartAxisZoomSliderPreview_1.ChartAxisZoomSliderPreview axisId={axisId} axisDirection={axisDirection} reverse={reverse} x={0} y={0} height={axisDirection === 'x' ? internals_1.ZOOM_SLIDER_PREVIEW_SIZE : drawingArea.height} width={axisDirection === 'x' ? drawingArea.width : internals_1.ZOOM_SLIDER_PREVIEW_SIZE}/>) : (<ChartAxisZoomSliderTrack_1.ChartAxisZoomSliderTrack x={axisDirection === 'x' ? 0 : backgroundRectOffset} y={axisDirection === 'x' ? backgroundRectOffset : 0} height={axisDirection === 'x' ? constants_1.ZOOM_SLIDER_TRACK_SIZE : drawingArea.height} width={axisDirection === 'x' ? drawingArea.width : constants_1.ZOOM_SLIDER_TRACK_SIZE} rx={constants_1.ZOOM_SLIDER_TRACK_SIZE / 2} ry={constants_1.ZOOM_SLIDER_TRACK_SIZE / 2} axisId={axisId} axisDirection={axisDirection} reverse={reverse} onSelectStart={tooltipConditions === 'hover' ? function () { return setShowTooltip(true); } : undefined} onSelectEnd={tooltipConditions === 'hover' ? function () { return setShowTooltip(false); } : undefined}/>);
    return (<g data-charts-zoom-slider transform={"translate(".concat(x, " ").concat(y, ")")} style={{ touchAction: 'none' }}>
      {track}
      <ChartAxisZoomSliderActiveTrack_1.ChartAxisZoomSliderActiveTrack zoomData={zoomData} axisId={axisId} axisPosition={axisPosition} axisDirection={axisDirection} reverse={reverse} showTooltip={(showTooltip && tooltipConditions !== 'never') || tooltipConditions === 'always'} size={showPreview ? internals_1.ZOOM_SLIDER_PREVIEW_SIZE : constants_1.ZOOM_SLIDER_ACTIVE_TRACK_SIZE} preview={showPreview} onPointerEnter={tooltipConditions === 'hover' ? function () { return setShowTooltip(true); } : undefined} onPointerLeave={tooltipConditions === 'hover' ? function () { return setShowTooltip(false); } : undefined}/>
    </g>);
}
