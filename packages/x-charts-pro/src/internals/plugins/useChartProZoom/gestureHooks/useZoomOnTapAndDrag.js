"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnTapAndDrag = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var useZoomOnTapAndDrag = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorZoomInteractionConfig, 'tapAndDrag');
    var isZoomOnTapAndDragEnabled = Object.keys(optionsLookup).length > 0 && Boolean(config);
    React.useEffect(function () {
        if (!isZoomOnTapAndDragEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('zoomTapAndDrag', {
            requiredKeys: config.requiredKeys,
            pointerMode: config.pointerMode,
            pointerOptions: {
                mouse: config.mouse,
                touch: config.touch,
            },
        });
    }, [config, isZoomOnTapAndDragEnabled, instance]);
    // Zoom on tap and drag
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (element === null || !isZoomOnTapAndDragEnabled) {
            return function () { };
        }
        var rafThrottledCallback = (0, rafThrottle_1.rafThrottle)(function (event) {
            // If the delta is 0, we didn't move
            if (event.detail.deltaY === 0) {
                return;
            }
            setZoomDataCallback(function (prev) {
                return prev.map(function (zoom) {
                    var option = optionsLookup[zoom.axisId];
                    if (!option) {
                        return zoom;
                    }
                    var isZoomIn = event.detail.deltaY > 0;
                    var scaleRatio = 1 + event.detail.deltaY / 100;
                    var point = (0, internals_1.getChartPoint)(element, {
                        clientX: event.detail.initialCentroid.x,
                        clientY: event.detail.initialCentroid.y,
                    });
                    var centerRatio = option.axisDirection === 'x'
                        ? (0, useZoom_utils_1.getHorizontalCenterRatio)(point, drawingArea, option.reverse)
                        : (0, useZoom_utils_1.getVerticalCenterRatio)(point, drawingArea, option.reverse);
                    var _a = (0, useZoom_utils_1.zoomAtPoint)(centerRatio, scaleRatio, zoom, option), newMinRange = _a[0], newMaxRange = _a[1];
                    if (!(0, useZoom_utils_1.isSpanValid)(newMinRange, newMaxRange, isZoomIn, option)) {
                        return zoom;
                    }
                    return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
                });
            });
        });
        var zoomHandler = instance.addInteractionListener('zoomTapAndDrag', rafThrottledCallback);
        return function () {
            zoomHandler.cleanup();
            rafThrottledCallback.clear();
        };
    }, [
        chartsLayerContainerRef,
        drawingArea,
        isZoomOnTapAndDragEnabled,
        optionsLookup,
        store,
        instance,
        setZoomDataCallback,
    ]);
};
exports.useZoomOnTapAndDrag = useZoomOnTapAndDrag;
