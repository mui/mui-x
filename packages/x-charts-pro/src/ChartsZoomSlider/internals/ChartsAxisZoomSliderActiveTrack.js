"use strict";
'use client';
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
exports.ChartsAxisZoomSliderActiveTrack = ChartsAxisZoomSliderActiveTrack;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var React = require("react");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var system_1 = require("@mui/system");
var useChartProZoom_1 = require("../../internals/plugins/useChartProZoom");
var ChartsAxisZoomSliderThumb_1 = require("./ChartsAxisZoomSliderThumb");
var ChartsTooltipZoomSliderValue_1 = require("./ChartsTooltipZoomSliderValue");
var zoom_utils_1 = require("./zoom-utils");
var constants_1 = require("./constants");
var chartsAxisZoomSliderTrackClasses_1 = require("./chartsAxisZoomSliderTrackClasses");
var ZoomSliderActiveTrackRect = (0, styles_1.styled)('rect', {
    slot: 'internal',
    shouldForwardProp: function (prop) { return (0, system_1.shouldForwardProp)(prop) && prop !== 'preview'; },
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ fill: (theme.vars || theme).palette.grey[600] }, theme.applyStyles('dark', {
        fill: (theme.vars || theme).palette.grey[500],
    })), { cursor: 'grab', variants: [
            {
                props: { preview: true },
                style: __assign(__assign({ fill: 'transparent' }, theme.applyStyles('dark', {
                    fill: 'transparent',
                })), { rx: 4, ry: 4, stroke: theme.palette.grey[500] }),
            },
        ] }));
});
function ChartsAxisZoomSliderActiveTrack(_a) {
    var axisId = _a.axisId, axisDirection = _a.axisDirection, axisPosition = _a.axisPosition, size = _a.size, preview = _a.preview, zoomData = _a.zoomData, reverse = _a.reverse, showTooltip = _a.showTooltip, onPointerEnter = _a.onPointerEnter, onPointerLeave = _a.onPointerLeave;
    var instance = (0, internals_1.useChartsContext)().instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var store = (0, internals_1.useStore)();
    var axis = store.use(internals_1.selectorChartAxis, axisId);
    var drawingArea = (0, internals_1.useDrawingArea)();
    var activePreviewRectRef = React.useRef(null);
    var _b = React.useState(null), startThumbEl = _b[0], setStartThumbEl = _b[1];
    var _c = React.useState(null), endThumbEl = _c[0], setEndThumbEl = _c[1];
    var _d = getZoomSliderTooltipsText(axis, drawingArea), tooltipStart = _d.tooltipStart, tooltipEnd = _d.tooltipEnd;
    var classes = (0, chartsAxisZoomSliderTrackClasses_1.useUtilityClasses)({ axisDirection: axisDirection });
    var previewThumbWidth = axisDirection === 'x' ? constants_1.ZOOM_SLIDER_THUMB_WIDTH : constants_1.ZOOM_SLIDER_THUMB_HEIGHT;
    var previewThumbHeight = axisDirection === 'x' ? constants_1.ZOOM_SLIDER_THUMB_HEIGHT : constants_1.ZOOM_SLIDER_THUMB_WIDTH;
    React.useEffect(function () {
        var activePreviewRect = activePreviewRectRef.current;
        if (!activePreviewRect) {
            return;
        }
        var prevPointerZoom = 0;
        var onPointerMove = (0, rafThrottle_1.rafThrottle)(function (event) {
            var element = chartsLayerContainerRef.current;
            if (!element) {
                return;
            }
            var point = (0, internals_1.getChartPoint)(element, event);
            var pointerZoom = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, point);
            if (pointerZoom === null) {
                return;
            }
            var deltaZoom = pointerZoom - prevPointerZoom;
            prevPointerZoom = pointerZoom;
            instance.moveZoomRange(axisId, deltaZoom);
        });
        var onPointerUp = function () {
            activePreviewRect.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };
        var onPointerDown = function (event) {
            // Prevent text selection when dragging
            event.preventDefault();
            activePreviewRect.setPointerCapture(event.pointerId);
            var axisZoomData = (0, useChartProZoom_1.selectorChartAxisZoomData)(store.state, axisId);
            var element = chartsLayerContainerRef.current;
            if (!axisZoomData || !element) {
                return;
            }
            var point = (0, internals_1.getChartPoint)(element, event);
            var pointerDownZoom = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, point);
            if (pointerDownZoom === null) {
                return;
            }
            prevPointerZoom = pointerDownZoom;
            document.addEventListener('pointerup', onPointerUp);
            activePreviewRect.addEventListener('pointermove', onPointerMove);
        };
        activePreviewRect.addEventListener('pointerdown', onPointerDown);
        // eslint-disable-next-line consistent-return
        return function () {
            activePreviewRect.removeEventListener('pointerdown', onPointerDown);
            onPointerMove.clear();
        };
    }, [axisDirection, axisId, instance, reverse, store, chartsLayerContainerRef]);
    var onStartThumbMove = function (event) {
        var element = chartsLayerContainerRef.current;
        if (!element) {
            return;
        }
        var point = (0, internals_1.getChartPoint)(element, event);
        instance.setZoomData(function (prevZoomData) {
            var zoomOptions = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.state, axisId);
            return prevZoomData.map(function (zoom) {
                if (zoom.axisId === axisId) {
                    var newStart = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, point);
                    if (newStart === null) {
                        return zoom;
                    }
                    return __assign(__assign({}, zoom), { start: (0, zoom_utils_1.calculateZoomStart)(newStart, zoom, zoomOptions) });
                }
                return zoom;
            });
        });
    };
    var onEndThumbMove = function (event) {
        var element = chartsLayerContainerRef.current;
        if (!element) {
            return;
        }
        var point = (0, internals_1.getChartPoint)(element, event);
        instance.setZoomData(function (prevZoomData) {
            var zoomOptions = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.state, axisId);
            return prevZoomData.map(function (zoom) {
                if (zoom.axisId === axisId) {
                    var newEnd = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, point);
                    if (newEnd === null) {
                        return zoom;
                    }
                    return __assign(__assign({}, zoom), { end: (0, zoom_utils_1.calculateZoomEnd)(newEnd, zoom, zoomOptions) });
                }
                return zoom;
            });
        });
    };
    var previewX;
    var previewY;
    var previewWidth;
    var previewHeight;
    var startThumbX;
    var startThumbY;
    var endThumbX;
    var endThumbY;
    var _e = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.state, axisId), minStart = _e.minStart, maxEnd = _e.maxEnd;
    var range = maxEnd - minStart;
    var zoomStart = Math.max(minStart, zoomData.start);
    var zoomEnd = Math.min(zoomData.end, maxEnd);
    if (axisDirection === 'x') {
        previewX = ((zoomStart - minStart) / range) * drawingArea.width;
        previewY = 0;
        previewWidth = (drawingArea.width * (zoomEnd - zoomStart)) / range;
        previewHeight = size;
        startThumbX = ((zoomStart - minStart) / range) * drawingArea.width;
        startThumbY = constants_1.ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - constants_1.ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
        endThumbX = ((zoomEnd - minStart) / range) * drawingArea.width;
        endThumbY = constants_1.ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - constants_1.ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
        if (reverse) {
            previewX = drawingArea.width - previewX - previewWidth;
            startThumbX = drawingArea.width - startThumbX;
            endThumbX = drawingArea.width - endThumbX;
        }
        startThumbX -= previewThumbWidth / 2;
        endThumbX -= previewThumbWidth / 2;
    }
    else {
        previewX = 0;
        previewY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;
        previewWidth = size;
        previewHeight = (drawingArea.height * (zoomEnd - zoomStart)) / range;
        startThumbX = constants_1.ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - constants_1.ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
        startThumbY = drawingArea.height - ((zoomStart - minStart) / range) * drawingArea.height;
        endThumbX = constants_1.ZOOM_SLIDER_THUMB_HEIGHT < size ? (size - constants_1.ZOOM_SLIDER_THUMB_HEIGHT) / 2 : 0;
        endThumbY = drawingArea.height - ((zoomEnd - minStart) / range) * drawingArea.height;
        if (reverse) {
            previewY = drawingArea.height - previewY - previewHeight;
            startThumbY = drawingArea.height - startThumbY;
            endThumbY = drawingArea.height - endThumbY;
        }
        startThumbY -= previewThumbHeight / 2;
        endThumbY -= previewThumbHeight / 2;
    }
    var previewOffset = constants_1.ZOOM_SLIDER_THUMB_HEIGHT > size ? (constants_1.ZOOM_SLIDER_THUMB_HEIGHT - size) / 2 : 0;
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(ZoomSliderActiveTrackRect, { ref: activePreviewRectRef, x: previewX + (axisDirection === 'x' ? 0 : previewOffset), y: previewY + (axisDirection === 'x' ? previewOffset : 0), preview: preview, width: previewWidth, height: previewHeight, onPointerEnter: onPointerEnter, onPointerLeave: onPointerLeave, className: classes.active }), (0, jsx_runtime_1.jsx)(ChartsAxisZoomSliderThumb_1.ChartsAxisZoomSliderThumb, { ref: setStartThumbEl, x: startThumbX, y: startThumbY, width: previewThumbWidth, height: previewThumbHeight, orientation: axisDirection === 'x' ? 'horizontal' : 'vertical', onMove: onStartThumbMove, onPointerEnter: onPointerEnter, onPointerLeave: onPointerLeave, placement: "start" }), (0, jsx_runtime_1.jsx)(ChartsAxisZoomSliderThumb_1.ChartsAxisZoomSliderThumb, { ref: setEndThumbEl, x: endThumbX, y: endThumbY, width: previewThumbWidth, height: previewThumbHeight, orientation: axisDirection === 'x' ? 'horizontal' : 'vertical', onMove: onEndThumbMove, onPointerEnter: onPointerEnter, onPointerLeave: onPointerLeave, placement: "end" }), (0, jsx_runtime_1.jsx)(ChartsTooltipZoomSliderValue_1.ChartsTooltipZoomSliderValue, { anchorEl: startThumbEl, open: showTooltip && tooltipStart !== '', placement: axisPosition, children: tooltipStart }), (0, jsx_runtime_1.jsx)(ChartsTooltipZoomSliderValue_1.ChartsTooltipZoomSliderValue, { anchorEl: endThumbEl, open: showTooltip && tooltipEnd !== '', placement: axisPosition, children: tooltipEnd })] }));
}
/**
 * Returns the text for the tooltips on the thumbs of the zoom slider.
 */
function getZoomSliderTooltipsText(axis, drawingArea) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h;
    var formatValue = function (value) {
        if (axis.valueFormatter) {
            return axis.valueFormatter(value, { location: 'zoom-slider-tooltip', scale: axis.scale });
        }
        return "".concat(value);
    };
    var axisDirection = axis.position === 'top' || axis.position === 'bottom' ? 'x' : 'y';
    var start = axisDirection === 'x' ? drawingArea.left : drawingArea.top;
    var size = axisDirection === 'x' ? drawingArea.width : drawingArea.height;
    var end = start + size;
    if (axisDirection === 'y') {
        _a = [end, start], start = _a[0], end = _a[1]; // Invert for y-axis
    }
    if (axis.reverse) {
        _b = [end, start], start = _b[0], end = _b[1]; // Reverse the start and end if the axis is reversed
    }
    var startValue = (_d = (0, internals_1.invertScale)(axis.scale, (_c = axis.data) !== null && _c !== void 0 ? _c : [], start)) !== null && _d !== void 0 ? _d : (_e = axis.data) === null || _e === void 0 ? void 0 : _e.at(0);
    var endValue = (_g = (0, internals_1.invertScale)(axis.scale, (_f = axis.data) !== null && _f !== void 0 ? _f : [], end)) !== null && _g !== void 0 ? _g : (_h = axis.data) === null || _h === void 0 ? void 0 : _h.at(-1);
    var tooltipStart = formatValue(startValue);
    var tooltipEnd = formatValue(endValue);
    return { tooltipStart: tooltipStart, tooltipEnd: tooltipEnd };
}
