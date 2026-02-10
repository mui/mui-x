"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartInteractionListener = void 0;
var React = require("react");
var core_1 = require("@mui/x-internal-gestures/core");
var preventDefault = function (event) { return event.preventDefault(); };
var useChartInteractionListener = function (_a) {
    var instance = _a.instance;
    var svgRef = instance.svgRef;
    var gestureManagerRef = React.useRef(null);
    React.useEffect(function () {
        var svg = svgRef.current;
        if (!gestureManagerRef.current) {
            gestureManagerRef.current = new core_1.GestureManager({
                gestures: [
                    // We separate the zoom gestures from the gestures that are not zoom related
                    // This allows us to configure the zoom gestures based on the zoom configuration.
                    new core_1.PanGesture({
                        name: 'pan',
                        threshold: 0,
                        maxPointers: 1,
                    }),
                    new core_1.MoveGesture({
                        name: 'move',
                        preventIf: ['pan', 'zoomPinch', 'zoomPan'],
                    }),
                    new core_1.TapGesture({
                        name: 'tap',
                        preventIf: ['pan', 'zoomPinch', 'zoomPan'],
                    }),
                    new core_1.PressGesture({
                        name: 'quickPress',
                        duration: 50,
                    }),
                    new core_1.PanGesture({
                        name: 'brush',
                        threshold: 0,
                        maxPointers: 1,
                    }),
                    // Zoom gestures
                    new core_1.PanGesture({
                        name: 'zoomPan',
                        threshold: 0,
                        preventIf: ['zoomTapAndDrag', 'zoomPressAndDrag'],
                    }),
                    new core_1.PinchGesture({
                        name: 'zoomPinch',
                        threshold: 5,
                    }),
                    new core_1.TurnWheelGesture({
                        name: 'zoomTurnWheel',
                        sensitivity: 0.01,
                        initialDelta: 1,
                    }),
                    new core_1.TurnWheelGesture({
                        name: 'panTurnWheel',
                        sensitivity: 0.5,
                    }),
                    new core_1.TapAndDragGesture({
                        name: 'zoomTapAndDrag',
                        dragThreshold: 10,
                    }),
                    new core_1.PressAndDragGesture({
                        name: 'zoomPressAndDrag',
                        dragThreshold: 10,
                        preventIf: ['zoomPinch'],
                    }),
                    new core_1.TapGesture({
                        name: 'zoomDoubleTapReset',
                        taps: 2,
                    }),
                ],
            });
        }
        // Assign gesture manager after initialization
        var gestureManager = gestureManagerRef.current;
        if (!svg || !gestureManager) {
            return undefined;
        }
        gestureManager.registerElement([
            'pan',
            'move',
            'zoomPinch',
            'zoomPan',
            'zoomTurnWheel',
            'panTurnWheel',
            'tap',
            'quickPress',
            'zoomTapAndDrag',
            'zoomPressAndDrag',
            'zoomDoubleTapReset',
            'brush',
        ], svg);
        return function () {
            // Cleanup gesture manager
            gestureManager.unregisterAllGestures(svg);
        };
    }, [svgRef, gestureManagerRef]);
    var addInteractionListener = React.useCallback(function (interaction, callback, options) {
        // Forcefully cast the svgRef to any, it is annoying to fix the types.
        var svg = svgRef.current;
        svg === null || svg === void 0 ? void 0 : svg.addEventListener(interaction, callback, options);
        return {
            cleanup: function () { return svg === null || svg === void 0 ? void 0 : svg.removeEventListener(interaction, callback, options); },
        };
    }, [svgRef]);
    var updateZoomInteractionListeners = React.useCallback(function (interaction, options) {
        var svg = svgRef.current;
        var gestureManager = gestureManagerRef.current;
        if (!gestureManager || !svg) {
            return;
        }
        gestureManager.setGestureOptions(interaction, svg, options !== null && options !== void 0 ? options : {});
    }, [svgRef, gestureManagerRef]);
    React.useEffect(function () {
        var svg = svgRef.current;
        // Disable gesture on safari
        // https://use-gesture.netlify.app/docs/gestures/#about-the-pinch-gesture
        svg === null || svg === void 0 ? void 0 : svg.addEventListener('gesturestart', preventDefault);
        svg === null || svg === void 0 ? void 0 : svg.addEventListener('gesturechange', preventDefault);
        svg === null || svg === void 0 ? void 0 : svg.addEventListener('gestureend', preventDefault);
        return function () {
            svg === null || svg === void 0 ? void 0 : svg.removeEventListener('gesturestart', preventDefault);
            svg === null || svg === void 0 ? void 0 : svg.removeEventListener('gesturechange', preventDefault);
            svg === null || svg === void 0 ? void 0 : svg.removeEventListener('gestureend', preventDefault);
        };
    }, [svgRef]);
    return {
        instance: {
            addInteractionListener: addInteractionListener,
            updateZoomInteractionListeners: updateZoomInteractionListeners,
        },
    };
};
exports.useChartInteractionListener = useChartInteractionListener;
exports.useChartInteractionListener.params = {};
exports.useChartInteractionListener.getInitialState = function () {
    return {};
};
