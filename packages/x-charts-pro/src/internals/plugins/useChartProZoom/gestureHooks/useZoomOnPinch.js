"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnPinch = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var useZoomOnPinch = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance, svgRef = _a.svgRef;
    var drawingArea = (0, internals_1.useSelector)(store, internals_1.selectorChartDrawingArea);
    var optionsLookup = (0, internals_1.useSelector)(store, internals_1.selectorChartZoomOptionsLookup);
    var isZoomEnabled = Object.keys(optionsLookup).length > 0;
    // Zoom on pinch
    React.useEffect(function () {
        var element = svgRef.current;
        if (element === null || !isZoomEnabled) {
            return function () { };
        }
        var rafThrottledCallback = (0, rafThrottle_1.rafThrottle)(function (event) {
            setZoomDataCallback(function (prev) {
                return prev.map(function (zoom) {
                    var option = optionsLookup[zoom.axisId];
                    if (!option) {
                        return zoom;
                    }
                    var isZoomIn = event.detail.direction > 0;
                    var scaleRatio = 1 + event.detail.deltaScale;
                    // If the delta is 0, it means the pinch gesture is not valid.
                    if (event.detail.direction === 0) {
                        return zoom;
                    }
                    var point = (0, internals_1.getSVGPoint)(element, {
                        clientX: event.detail.centroid.x,
                        clientY: event.detail.centroid.y,
                    });
                    var centerRatio = option.axisDirection === 'x'
                        ? (0, useZoom_utils_1.getHorizontalCenterRatio)(point, drawingArea)
                        : (0, useZoom_utils_1.getVerticalCenterRatio)(point, drawingArea);
                    var _a = (0, useZoom_utils_1.zoomAtPoint)(centerRatio, scaleRatio, zoom, option), newMinRange = _a[0], newMaxRange = _a[1];
                    if (!(0, useZoom_utils_1.isSpanValid)(newMinRange, newMaxRange, isZoomIn, option)) {
                        return zoom;
                    }
                    return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
                });
            });
        });
        var zoomHandler = instance.addInteractionListener('pinch', rafThrottledCallback);
        return function () {
            zoomHandler.cleanup();
            rafThrottledCallback.clear();
        };
    }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, store, instance, setZoomDataCallback]);
};
exports.useZoomOnPinch = useZoomOnPinch;
