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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartProZoom = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var debounce_1 = require("@mui/utils/debounce");
var useEffectAfterFirstRender_1 = require("@mui/x-internals/useEffectAfterFirstRender");
var utils_1 = require("@mui/material/utils");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var calculateZoom_1 = require("./calculateZoom");
var useZoomOnWheel_1 = require("./gestureHooks/useZoomOnWheel");
var useZoomOnPinch_1 = require("./gestureHooks/useZoomOnPinch");
var usePanOnDrag_1 = require("./gestureHooks/usePanOnDrag");
var usePanOnWheel_1 = require("./gestureHooks/usePanOnWheel");
var useZoomOnTapAndDrag_1 = require("./gestureHooks/useZoomOnTapAndDrag");
var usePanOnPressAndDrag_1 = require("./gestureHooks/usePanOnPressAndDrag");
var useZoomOnBrush_1 = require("./gestureHooks/useZoomOnBrush");
var useZoomOnDoubleTapReset_1 = require("./gestureHooks/useZoomOnDoubleTapReset");
var initializeZoomInteractionConfig_1 = require("./initializeZoomInteractionConfig");
var initializeZoomData_1 = require("./initializeZoomData");
var useChartProZoom = function (pluginData) {
    var store = pluginData.store, params = pluginData.params;
    var paramsZoomData = params.zoomData, onZoomChangeProp = params.onZoomChange, zoomInteractionConfig = params.zoomInteractionConfig;
    var onZoomChange = (0, utils_1.useEventCallback)(onZoomChangeProp !== null && onZoomChangeProp !== void 0 ? onZoomChangeProp : (function () { }));
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    (0, useEffectAfterFirstRender_1.useEffectAfterFirstRender)(function () {
        store.set('zoom', __assign(__assign({}, store.state.zoom), { zoomInteractionConfig: (0, initializeZoomInteractionConfig_1.initializeZoomInteractionConfig)(zoomInteractionConfig, optionsLookup) }));
    }, [store, zoomInteractionConfig, optionsLookup]);
    // This is debounced. We want to run it only once after the interaction ends.
    var removeIsInteracting = React.useMemo(function () {
        return (0, debounce_1.default)(function () {
            return store.set('zoom', __assign(__assign({}, store.state.zoom), { isInteracting: false }));
        }, 166);
    }, [store]);
    // Manage controlled state
    React.useEffect(function () {
        if (paramsZoomData === undefined) {
            return;
        }
        if (process.env.NODE_ENV !== 'production' && !store.state.zoom.isControlled) {
            console.error([
                "MUI X Charts: A chart component is changing the `zoomData` from uncontrolled to controlled.",
                'Elements should not switch from uncontrolled to controlled (or vice versa).',
                'Decide between using a controlled or uncontrolled for the lifetime of the component.',
                "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
                'More info: https://fb.me/react-controlled-components',
            ].join('\n'));
        }
        store.set('zoom', __assign(__assign({}, store.state.zoom), { isInteracting: true, zoomData: paramsZoomData }));
        removeIsInteracting();
    }, [store, paramsZoomData, removeIsInteracting]);
    var setZoomDataCallback = React.useCallback(function (zoomData) {
        var newZoomData = typeof zoomData === 'function' ? zoomData(__spreadArray([], store.state.zoom.zoomData, true)) : zoomData;
        if ((0, isDeepEqual_1.isDeepEqual)(store.state.zoom.zoomData, newZoomData)) {
            return;
        }
        onZoomChange(newZoomData);
        if (store.state.zoom.isControlled) {
            store.set('zoom', __assign(__assign({}, store.state.zoom), { isInteracting: true }));
        }
        else {
            store.set('zoom', __assign(__assign({}, store.state.zoom), { isInteracting: true, zoomData: newZoomData }));
            removeIsInteracting();
        }
    }, [onZoomChange, store, removeIsInteracting]);
    var setAxisZoomData = React.useCallback(function (axisId, zoomData) {
        setZoomDataCallback(function (prev) {
            return prev.map(function (prevZoom) {
                if (prevZoom.axisId !== axisId) {
                    return prevZoom;
                }
                return typeof zoomData === 'function' ? zoomData(prevZoom) : zoomData;
            });
        });
    }, [setZoomDataCallback]);
    var moveZoomRange = React.useCallback(function (axisId, by) {
        setZoomDataCallback(function (prevZoomData) {
            return prevZoomData.map(function (zoom) {
                if (zoom.axisId !== axisId) {
                    return zoom;
                }
                var options = optionsLookup[axisId];
                if (!options) {
                    return zoom;
                }
                var start = zoom.start;
                var end = zoom.end;
                if (by > 0) {
                    var span = end - start;
                    end = Math.min(end + by, options.maxEnd);
                    start = end - span;
                }
                else {
                    var span = end - start;
                    start = Math.max(start + by, options.minStart);
                    end = start + span;
                }
                return __assign(__assign({}, zoom), { start: start, end: end });
            });
        });
    }, [optionsLookup, setZoomDataCallback]);
    React.useEffect(function () {
        return function () {
            removeIsInteracting.clear();
        };
    }, [removeIsInteracting]);
    // Add events
    (0, usePanOnDrag_1.usePanOnDrag)(pluginData, setZoomDataCallback);
    (0, usePanOnPressAndDrag_1.usePanOnPressAndDrag)(pluginData, setZoomDataCallback);
    (0, usePanOnWheel_1.usePanOnWheel)(pluginData, setZoomDataCallback);
    (0, useZoomOnWheel_1.useZoomOnWheel)(pluginData, setZoomDataCallback);
    (0, useZoomOnPinch_1.useZoomOnPinch)(pluginData, setZoomDataCallback);
    (0, useZoomOnTapAndDrag_1.useZoomOnTapAndDrag)(pluginData, setZoomDataCallback);
    (0, useZoomOnBrush_1.useZoomOnBrush)(pluginData, setZoomDataCallback);
    (0, useZoomOnDoubleTapReset_1.useZoomOnDoubleTapReset)(pluginData, setZoomDataCallback);
    var zoom = React.useCallback(function (step) {
        setZoomDataCallback(function (prev) {
            return prev.map(function (zoomData) {
                var zoomOptions = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.state, zoomData.axisId);
                return (0, calculateZoom_1.calculateZoom)(zoomData, step, zoomOptions);
            });
        });
    }, [setZoomDataCallback, store]);
    var zoomIn = React.useCallback(function () { return zoom(0.1); }, [zoom]);
    var zoomOut = React.useCallback(function () { return zoom(-0.1); }, [zoom]);
    return {
        publicAPI: {
            setZoomData: setZoomDataCallback,
            setAxisZoomData: setAxisZoomData,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
        },
        instance: {
            setZoomData: setZoomDataCallback,
            setAxisZoomData: setAxisZoomData,
            moveZoomRange: moveZoomRange,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
        },
    };
};
exports.useChartProZoom = useChartProZoom;
exports.useChartProZoom.params = {
    initialZoom: true,
    onZoomChange: true,
    zoomData: true,
    zoomInteractionConfig: true,
};
exports.useChartProZoom.getInitialState = function (params) {
    var initialZoom = params.initialZoom, zoomData = params.zoomData, defaultizedXAxis = params.defaultizedXAxis, defaultizedYAxis = params.defaultizedYAxis;
    var optionsLookup = __assign(__assign({}, (0, internals_1.createZoomLookup)('x')(defaultizedXAxis)), (0, internals_1.createZoomLookup)('y')(defaultizedYAxis));
    var userZoomData = 
    // eslint-disable-next-line no-nested-ternary
    zoomData !== undefined ? zoomData : initialZoom !== undefined ? initialZoom : undefined;
    return {
        zoom: {
            zoomData: (0, initializeZoomData_1.initializeZoomData)(optionsLookup, userZoomData),
            isInteracting: false,
            isControlled: zoomData !== undefined,
            zoomInteractionConfig: (0, initializeZoomInteractionConfig_1.initializeZoomInteractionConfig)(params.zoomInteractionConfig, optionsLookup),
        },
    };
};
