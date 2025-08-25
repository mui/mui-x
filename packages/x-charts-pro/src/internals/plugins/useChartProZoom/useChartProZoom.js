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
exports.initializeZoomData = initializeZoomData;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var debounce_1 = require("@mui/utils/debounce");
var utils_1 = require("@mui/material/utils");
var calculateZoom_1 = require("./calculateZoom");
var useZoomOnWheel_1 = require("./gestureHooks/useZoomOnWheel");
var useZoomOnPinch_1 = require("./gestureHooks/useZoomOnPinch");
var usePanOnDrag_1 = require("./gestureHooks/usePanOnDrag");
// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
function initializeZoomData(options, zoomData) {
    var zoomDataMap = new Map();
    zoomData === null || zoomData === void 0 ? void 0 : zoomData.forEach(function (zoom) {
        var option = options[zoom.axisId];
        if (option) {
            zoomDataMap.set(zoom.axisId, zoom);
        }
    });
    return Object.values(options).map(function (_a) {
        var axisId = _a.axisId, start = _a.minStart, end = _a.maxEnd;
        if (zoomDataMap.has(axisId)) {
            return zoomDataMap.get(axisId);
        }
        return {
            axisId: axisId,
            start: start,
            end: end,
        };
    });
}
var useChartProZoom = function (_a) {
    var store = _a.store, instance = _a.instance, svgRef = _a.svgRef, params = _a.params;
    var paramsZoomData = params.zoomData, onZoomChangeProp = params.onZoomChange;
    var onZoomChange = (0, utils_1.useEventCallback)(onZoomChangeProp !== null && onZoomChangeProp !== void 0 ? onZoomChangeProp : (function () { }));
    var optionsLookup = (0, internals_1.useSelector)(store, internals_1.selectorChartZoomOptionsLookup);
    // Manage controlled state
    React.useEffect(function () {
        if (paramsZoomData === undefined) {
            return undefined;
        }
        store.update(function (prevState) {
            if (process.env.NODE_ENV !== 'production' && !prevState.zoom.isControlled) {
                console.error([
                    "MUI X Charts: A chart component is changing the `zoomData` from uncontrolled to controlled.",
                    'Elements should not switch from uncontrolled to controlled (or vice versa).',
                    'Decide between using a controlled or uncontrolled for the lifetime of the component.',
                    "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
                    'More info: https://fb.me/react-controlled-components',
                ].join('\n'));
            }
            return __assign(__assign({}, prevState), { zoom: __assign(__assign({}, prevState.zoom), { isInteracting: true, zoomData: paramsZoomData }) });
        });
        var timeout = setTimeout(function () {
            store.update(function (prevState) {
                return __assign(__assign({}, prevState), { zoom: __assign(__assign({}, prevState.zoom), { isInteracting: false }) });
            });
        }, 166);
        return function () {
            clearTimeout(timeout);
        };
    }, [store, paramsZoomData]);
    // This is debounced. We want to run it only once after the interaction ends.
    var removeIsInteracting = React.useMemo(function () {
        return (0, debounce_1.default)(function () {
            return store.update(function (prevState) {
                return __assign(__assign({}, prevState), { zoom: __assign(__assign({}, prevState.zoom), { isInteracting: false }) });
            });
        }, 166);
    }, [store]);
    var setZoomDataCallback = React.useCallback(function (zoomData) {
        store.update(function (prevState) {
            var newZoomData = typeof zoomData === 'function' ? zoomData(__spreadArray([], prevState.zoom.zoomData, true)) : zoomData;
            onZoomChange === null || onZoomChange === void 0 ? void 0 : onZoomChange(newZoomData);
            if (prevState.zoom.isControlled) {
                return prevState;
            }
            removeIsInteracting();
            return __assign(__assign({}, prevState), { zoom: __assign(__assign({}, prevState.zoom), { isInteracting: true, zoomData: newZoomData }) });
        });
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
    var pluginData = { store: store, instance: instance, svgRef: svgRef };
    (0, usePanOnDrag_1.usePanOnDrag)(pluginData, setZoomDataCallback);
    (0, useZoomOnWheel_1.useZoomOnWheel)(pluginData, setZoomDataCallback);
    (0, useZoomOnPinch_1.useZoomOnPinch)(pluginData, setZoomDataCallback);
    var zoom = React.useCallback(function (step) {
        setZoomDataCallback(function (prev) {
            return prev.map(function (zoomData) {
                var zoomOptions = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.getSnapshot(), zoomData.axisId);
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
};
exports.useChartProZoom.getDefaultizedParams = function (_a) {
    var params = _a.params;
    return __assign({}, params);
};
exports.useChartProZoom.getInitialState = function (params) {
    var initialZoom = params.initialZoom, zoomData = params.zoomData, defaultizedXAxis = params.defaultizedXAxis, defaultizedYAxis = params.defaultizedYAxis;
    var optionsLookup = __assign(__assign({}, (0, internals_1.createZoomLookup)('x')(defaultizedXAxis)), (0, internals_1.createZoomLookup)('y')(defaultizedYAxis));
    var userZoomData = 
    // eslint-disable-next-line no-nested-ternary
    zoomData !== undefined ? zoomData : initialZoom !== undefined ? initialZoom : undefined;
    return {
        zoom: {
            zoomData: initializeZoomData(optionsLookup, userZoomData),
            isInteracting: false,
            isControlled: zoomData !== undefined,
        },
    };
};
