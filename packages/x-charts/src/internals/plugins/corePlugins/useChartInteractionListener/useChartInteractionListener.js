"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartInteractionListener = void 0;
var React = require("react");
var core_1 = require("@mui/x-internal-gestures/core");
var preventDefault = function (event) { return event.preventDefault(); };
var useChartInteractionListener = function (_a) {
    var svgRef = _a.svgRef;
    React.useEffect(function () {
        var svg = svgRef.current;
        if (!svg) {
            return undefined;
        }
        var gestureManager = new core_1.GestureManager({
            gestures: [
                new core_1.PanGesture({
                    name: 'pan',
                    threshold: 0,
                    maxPointers: 1,
                }),
                new core_1.MoveGesture({
                    name: 'move',
                    preventIf: ['pan', 'pinch'], // Prevent move gesture when pan is active
                }),
                new core_1.PinchGesture({
                    name: 'pinch',
                    threshold: 5,
                    preventIf: ['pan'],
                }),
                new core_1.TurnWheelGesture({
                    name: 'turnWheel',
                    sensitivity: 0.01,
                    initialDelta: 1,
                }),
                new core_1.TapGesture({
                    name: 'tap',
                    maxDistance: 10,
                    preventIf: ['pan', 'pinch'],
                }),
                new core_1.PressGesture({
                    name: 'quickPress',
                    duration: 50,
                    maxDistance: 10,
                }),
            ],
        });
        gestureManager.registerElement(['pan', 'move', 'pinch', 'turnWheel', 'tap', 'quickPress'], svg);
        return function () {
            // Cleanup gesture manager
            gestureManager.destroy();
        };
    }, [svgRef]);
    var addInteractionListener = React.useCallback(function (interaction, callback, options) {
        // Forcefully cast the svgRef to any, it is annoying to fix the types.
        var svg = svgRef.current;
        svg === null || svg === void 0 ? void 0 : svg.addEventListener(interaction, callback, options);
        return {
            cleanup: function () { return svg === null || svg === void 0 ? void 0 : svg.removeEventListener(interaction, callback); },
        };
    }, [svgRef]);
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
        },
    };
};
exports.useChartInteractionListener = useChartInteractionListener;
exports.useChartInteractionListener.params = {};
exports.useChartInteractionListener.getInitialState = function () {
    return {};
};
