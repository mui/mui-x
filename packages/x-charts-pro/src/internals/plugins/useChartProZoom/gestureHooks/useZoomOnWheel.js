"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnWheel = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var useZoomOnWheel = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var startedOutsideRef = React.useRef(false);
    var startedOutsideTimeoutRef = React.useRef(null);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorZoomInteractionConfig, 'wheel');
    var isZoomOnWheelEnabled = Object.keys(optionsLookup).length > 0 && Boolean(config);
    React.useEffect(function () {
        if (!isZoomOnWheelEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('zoomTurnWheel', {
            requiredKeys: config.requiredKeys,
        });
    }, [config, isZoomOnWheelEnabled, instance]);
    // Add event for chart zoom in/out
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (element === null || !isZoomOnWheelEnabled) {
            return function () { };
        }
        var rafThrottledSetZoomData = (0, rafThrottle_1.rafThrottle)(setZoomDataCallback);
        var zoomOnWheelHandler = instance.addInteractionListener('zoomTurnWheel', function (event) {
            var point = (0, internals_1.getChartPoint)(element, {
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
                        ? (0, useZoom_utils_1.getHorizontalCenterRatio)(point, drawingArea, option.reverse)
                        : (0, useZoom_utils_1.getVerticalCenterRatio)(point, drawingArea, option.reverse);
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
    }, [
        chartsLayerContainerRef,
        drawingArea,
        isZoomOnWheelEnabled,
        optionsLookup,
        instance,
        setZoomDataCallback,
        store,
    ]);
};
exports.useZoomOnWheel = useZoomOnWheel;
