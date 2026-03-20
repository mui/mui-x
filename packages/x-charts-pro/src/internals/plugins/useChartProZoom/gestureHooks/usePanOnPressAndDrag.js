"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanOnPressAndDrag = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var usePanOnPressAndDrag = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var isInteracting = React.useRef(false);
    var accumulatedChange = React.useRef({ x: 0, y: 0 });
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorPanInteractionConfig, 'pressAndDrag');
    var isPanOnPressAndDragEnabled = Object.values(optionsLookup).some(function (v) { return v.panning; }) && Boolean(config);
    React.useEffect(function () {
        if (!isPanOnPressAndDragEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('zoomPressAndDrag', {
            requiredKeys: config.requiredKeys,
            pointerMode: config.pointerMode,
            pointerOptions: {
                mouse: config.mouse,
                touch: config.touch,
            },
        });
    }, [isPanOnPressAndDragEnabled, config, instance]);
    // Add event for chart panning with press and drag
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (element === null || !isPanOnPressAndDragEnabled) {
            return function () { };
        }
        var handlePressAndDragStart = function (event) {
            var _a;
            if (!((_a = event.detail.target) === null || _a === void 0 ? void 0 : _a.closest('[data-charts-zoom-slider]'))) {
                isInteracting.current = true;
                accumulatedChange.current = { x: 0, y: 0 };
            }
        };
        var handlePressAndDragEnd = function () {
            isInteracting.current = false;
        };
        var throttledCallback = (0, rafThrottle_1.rafThrottle)(function () {
            var x = accumulatedChange.current.x;
            var y = accumulatedChange.current.y;
            accumulatedChange.current.x = 0;
            accumulatedChange.current.y = 0;
            setZoomDataCallback(function (prev) {
                return (0, useZoom_utils_1.translateZoom)(prev, { x: x, y: -y }, {
                    width: drawingArea.width,
                    height: drawingArea.height,
                }, optionsLookup);
            });
        });
        var handlePressAndDrag = function (event) {
            if (!isInteracting.current) {
                return;
            }
            accumulatedChange.current.x += event.detail.deltaX;
            accumulatedChange.current.y += event.detail.deltaY;
            throttledCallback();
        };
        var pressAndDragHandler = instance.addInteractionListener('zoomPressAndDrag', handlePressAndDrag);
        var pressAndDragStartHandler = instance.addInteractionListener('zoomPressAndDragStart', handlePressAndDragStart);
        var pressAndDragEndHandler = instance.addInteractionListener('zoomPressAndDragEnd', handlePressAndDragEnd);
        return function () {
            pressAndDragStartHandler.cleanup();
            pressAndDragHandler.cleanup();
            pressAndDragEndHandler.cleanup();
            throttledCallback.clear();
        };
    }, [
        instance,
        chartsLayerContainerRef,
        isPanOnPressAndDragEnabled,
        optionsLookup,
        drawingArea.width,
        drawingArea.height,
        setZoomDataCallback,
        store,
        isInteracting,
    ]);
};
exports.usePanOnPressAndDrag = usePanOnPressAndDrag;
