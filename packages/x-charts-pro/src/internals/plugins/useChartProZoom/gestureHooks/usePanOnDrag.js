"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanOnDrag = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var usePanOnDrag = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorPanInteractionConfig, 'drag');
    var isPanOnDragEnabled = Object.values(optionsLookup).some(function (v) { return v.panning; }) && Boolean(config);
    React.useEffect(function () {
        if (!isPanOnDragEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('zoomPan', {
            requiredKeys: config.requiredKeys,
            pointerMode: config.pointerMode,
            pointerOptions: {
                mouse: config.mouse,
                touch: config.touch,
            },
        });
    }, [isPanOnDragEnabled, config, instance]);
    // Add event for chart panning
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        var isInteracting = false;
        var accumulatedChange = { x: 0, y: 0 };
        if (element === null || !isPanOnDragEnabled) {
            return function () { };
        }
        var handlePanStart = function (event) {
            var _a;
            if (!((_a = event.detail.target) === null || _a === void 0 ? void 0 : _a.closest('[data-charts-zoom-slider]'))) {
                isInteracting = true;
            }
        };
        var handlePanEnd = function () {
            isInteracting = false;
        };
        var throttledCallback = (0, rafThrottle_1.rafThrottle)(function () {
            var x = accumulatedChange.x;
            var y = accumulatedChange.y;
            accumulatedChange.x = 0;
            accumulatedChange.y = 0;
            setZoomDataCallback(function (prev) {
                return (0, useZoom_utils_1.translateZoom)(prev, { x: x, y: -y }, {
                    width: drawingArea.width,
                    height: drawingArea.height,
                }, optionsLookup);
            });
        });
        var handlePan = function (event) {
            if (!isInteracting) {
                return;
            }
            accumulatedChange.x += event.detail.deltaX;
            accumulatedChange.y += event.detail.deltaY;
            throttledCallback();
        };
        var panHandler = instance.addInteractionListener('zoomPan', handlePan);
        var panStartHandler = instance.addInteractionListener('zoomPanStart', handlePanStart);
        var panEndHandler = instance.addInteractionListener('zoomPanEnd', handlePanEnd);
        return function () {
            panStartHandler.cleanup();
            panHandler.cleanup();
            panEndHandler.cleanup();
            throttledCallback.clear();
        };
    }, [
        instance,
        chartsLayerContainerRef,
        isPanOnDragEnabled,
        optionsLookup,
        drawingArea.width,
        drawingArea.height,
        setZoomDataCallback,
        store,
    ]);
};
exports.usePanOnDrag = usePanOnDrag;
