"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnWheel = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var useZoomOnWheel = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance, svgRef = _a.svgRef;
    var drawingArea = (0, internals_1.useSelector)(store, internals_1.selectorChartDrawingArea);
    var optionsLookup = (0, internals_1.useSelector)(store, internals_1.selectorChartZoomOptionsLookup);
    var isZoomEnabled = Object.keys(optionsLookup).length > 0;
    var startedOutsideRef = React.useRef(false);
    var startedOutsideTimeoutRef = React.useRef(null);
    // Add event for chart zoom in/out
    React.useEffect(function () {
        var element = svgRef.current;
        if (element === null || !isZoomEnabled) {
            return function () { };
        }
        var rafThrottledSetZoomData = (0, rafThrottle_1.rafThrottle)(setZoomDataCallback);
        var zoomOnWheelHandler = instance.addInteractionListener('turnWheel', function (event) {
            var point = (0, internals_1.getSVGPoint)(element, {
                clientX: event.detail.centroid.x,
                clientY: event.detail.centroid.y,
            });
            // This prevents a zoom event from being triggered when the mouse is outside the chart area.
            // The timeout is used to prevent an weird behavior where if the mouse is outside but enters due to
            // scrolling, then the zoom event is triggered.
            if (startedOutsideRef.current || !instance.isPointInside(point.x, point.y)) {
                startedOutsideRef.current = true;
                if (startedOutsideTimeoutRef.current) {
                    clearTimeout(startedOutsideTimeoutRef.current);
                }
                startedOutsideTimeoutRef.current = setTimeout(function () {
                    startedOutsideRef.current = false;
                    startedOutsideTimeoutRef.current = null;
                }, 100);
                return;
            }
            event.detail.srcEvent.preventDefault();
            rafThrottledSetZoomData(function (prev) {
                return prev.map(function (zoom) {
                    var option = optionsLookup[zoom.axisId];
                    if (!option) {
                        return zoom;
                    }
                    var centerRatio = option.axisDirection === 'x'
                        ? (0, useZoom_utils_1.getHorizontalCenterRatio)(point, drawingArea)
                        : (0, useZoom_utils_1.getVerticalCenterRatio)(point, drawingArea);
                    var _a = (0, useZoom_utils_1.getWheelScaleRatio)(event.detail.srcEvent, option.step), scaleRatio = _a.scaleRatio, isZoomIn = _a.isZoomIn;
                    var _b = (0, useZoom_utils_1.zoomAtPoint)(centerRatio, scaleRatio, zoom, option), newMinRange = _b[0], newMaxRange = _b[1];
                    if (!(0, useZoom_utils_1.isSpanValid)(newMinRange, newMaxRange, isZoomIn, option)) {
                        return zoom;
                    }
                    return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
                });
            });
        });
        return function () {
            zoomOnWheelHandler.cleanup();
            if (startedOutsideTimeoutRef.current) {
                clearTimeout(startedOutsideTimeoutRef.current);
                startedOutsideTimeoutRef.current = null;
            }
            startedOutsideRef.current = false;
            rafThrottledSetZoomData.clear();
        };
    }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, instance, setZoomDataCallback, store]);
};
exports.useZoomOnWheel = useZoomOnWheel;
