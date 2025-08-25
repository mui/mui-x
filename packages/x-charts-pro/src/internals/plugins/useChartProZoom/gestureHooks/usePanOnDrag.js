"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanOnDrag = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var usePanOnDrag = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance, svgRef = _a.svgRef;
    var drawingArea = (0, internals_1.useSelector)(store, internals_1.selectorChartDrawingArea);
    var optionsLookup = (0, internals_1.useSelector)(store, internals_1.selectorChartZoomOptionsLookup);
    var startRef = React.useRef(null);
    // Add event for chart panning
    var isPanEnabled = React.useMemo(function () { return Object.values(optionsLookup).some(function (v) { return v.panning; }) || false; }, [optionsLookup]);
    React.useEffect(function () {
        var element = svgRef.current;
        if (element === null || !isPanEnabled) {
            return function () { };
        }
        var handlePanStart = function (event) {
            var _a;
            if (!((_a = event.detail.target) === null || _a === void 0 ? void 0 : _a.closest('[data-charts-zoom-slider]'))) {
                startRef.current = store.value.zoom.zoomData;
            }
        };
        var handlePanEnd = function () {
            startRef.current = null;
        };
        var throttledCallback = (0, rafThrottle_1.rafThrottle)(function (event, zoomData) {
            var newZoomData = (0, useZoom_utils_1.translateZoom)(zoomData, { x: event.detail.activeDeltaX, y: -event.detail.activeDeltaY }, {
                width: drawingArea.width,
                height: drawingArea.height,
            }, optionsLookup);
            setZoomDataCallback(newZoomData);
        });
        var handlePan = function (event) {
            var zoomData = startRef.current;
            if (!zoomData) {
                return;
            }
            throttledCallback(event, zoomData);
        };
        var panHandler = instance.addInteractionListener('pan', handlePan);
        var panStartHandler = instance.addInteractionListener('panStart', handlePanStart);
        var panEndHandler = instance.addInteractionListener('panEnd', handlePanEnd);
        return function () {
            panStartHandler.cleanup();
            panHandler.cleanup();
            panEndHandler.cleanup();
            throttledCallback.clear();
        };
    }, [
        instance,
        svgRef,
        isPanEnabled,
        optionsLookup,
        drawingArea.width,
        drawingArea.height,
        setZoomDataCallback,
        store,
        startRef,
    ]);
};
exports.usePanOnDrag = usePanOnDrag;
