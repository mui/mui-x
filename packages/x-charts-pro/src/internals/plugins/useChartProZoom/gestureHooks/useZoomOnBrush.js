"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnBrush = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var useZoomOnBrush = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorZoomInteractionConfig, 'brush');
    var isZoomOnBrushEnabled = Object.keys(optionsLookup).length > 0 && Boolean(config);
    React.useEffect(function () {
        if ('setZoomBrushEnabled' in instance) {
            instance.setZoomBrushEnabled(isZoomOnBrushEnabled);
        }
    }, [isZoomOnBrushEnabled, instance]);
    React.useEffect(function () {
        if (!isZoomOnBrushEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('brush', {
            requiredKeys: config.requiredKeys,
            pointerMode: config.pointerMode,
            pointerOptions: {
                mouse: config.mouse,
                touch: config.touch,
            },
        });
    }, [isZoomOnBrushEnabled, config, instance]);
    // Zoom on brush
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (element === null || !isZoomOnBrushEnabled) {
            return function () { };
        }
        var handleBrushEnd = function (event) {
            // Convert the brush rectangle to zoom percentages for each axis
            setZoomDataCallback(function (prev) {
                var startPoint = (0, internals_1.getChartPoint)(element, {
                    clientX: event.detail.initialCentroid.x,
                    clientY: event.detail.initialCentroid.y,
                });
                var endPoint = (0, internals_1.getChartPoint)(element, {
                    clientX: event.detail.centroid.x,
                    clientY: event.detail.centroid.y,
                });
                // Calculate the brush rectangle
                var minX = Math.min(startPoint.x, endPoint.x);
                var maxX = Math.max(startPoint.x, endPoint.x);
                var minY = Math.min(startPoint.y, endPoint.y);
                var maxY = Math.max(startPoint.y, endPoint.y);
                return prev.map(function (zoom) {
                    var option = optionsLookup[zoom.axisId];
                    if (!option) {
                        return zoom;
                    }
                    var startRatio;
                    var endRatio;
                    var reverse = option.reverse;
                    if (option.axisDirection === 'x') {
                        startRatio = (0, useZoom_utils_1.getHorizontalCenterRatio)({ x: minX, y: 0 }, drawingArea, reverse);
                        endRatio = (0, useZoom_utils_1.getHorizontalCenterRatio)({ x: maxX, y: 0 }, drawingArea, reverse);
                    }
                    else {
                        startRatio = (0, useZoom_utils_1.getVerticalCenterRatio)({ x: 0, y: maxY }, drawingArea, reverse);
                        endRatio = (0, useZoom_utils_1.getVerticalCenterRatio)({ x: 0, y: minY }, drawingArea, reverse);
                    }
                    // Ensure start < end regardless of reverse
                    var minRatio = Math.min(startRatio, endRatio);
                    var maxRatio = Math.max(startRatio, endRatio);
                    // Calculate the new zoom range based on the current zoom state
                    // This is important: we need to map the brush selection ratios to the current zoom range
                    var currentStart = zoom.start;
                    var currentEnd = zoom.end;
                    var currentSpan = currentEnd - currentStart;
                    var newStart = currentStart + minRatio * currentSpan;
                    var newEnd = currentStart + maxRatio * currentSpan;
                    var clampedStart = Math.max(option.minStart, Math.min(option.maxEnd, newStart));
                    var clampedEnd = Math.max(option.minStart, Math.min(option.maxEnd, newEnd));
                    if (!(0, useZoom_utils_1.isSpanValid)(clampedStart, clampedEnd, true, option)) {
                        return zoom;
                    }
                    return {
                        axisId: zoom.axisId,
                        start: clampedStart,
                        end: clampedEnd,
                    };
                });
            });
        };
        var brushEndHandler = instance.addInteractionListener('brushEnd', handleBrushEnd);
        return function () {
            brushEndHandler.cleanup();
        };
    }, [
        chartsLayerContainerRef,
        drawingArea,
        isZoomOnBrushEnabled,
        optionsLookup,
        instance,
        setZoomDataCallback,
        store,
    ]);
};
exports.useZoomOnBrush = useZoomOnBrush;
