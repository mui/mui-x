"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePanOnWheel = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var useZoom_utils_1 = require("./useZoom.utils");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var usePanOnWheel = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var drawingArea = store.use(internals_1.selectorChartDrawingArea);
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var startedOutsideRef = React.useRef(false);
    var startedOutsideTimeoutRef = React.useRef(null);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorPanInteractionConfig, 'wheel');
    var isPanOnWheelEnabled = Object.keys(optionsLookup).length > 0 && Boolean(config);
    React.useEffect(function () {
        if (!isPanOnWheelEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('panTurnWheel', {
            requiredKeys: config.requiredKeys,
        });
    }, [config, isPanOnWheelEnabled, instance]);
    // Add event for chart pan on wheel
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        var accumulatedChange = { x: 0, y: 0 };
        if (element === null || !isPanOnWheelEnabled) {
            return function () { };
        }
        var rafThrottledSetZoomData = (0, rafThrottle_1.rafThrottle)(setZoomDataCallback);
        var wheelHandler = instance.addInteractionListener('panTurnWheel', function (event) {
            var _a;
            var point = (0, internals_1.getChartPoint)(element, {
                clientX: event.detail.centroid.x,
                clientY: event.detail.centroid.y,
            });
            // This prevents a pan event from being triggered when the mouse is outside the chart area.
            // The timeout is used to prevent an weird behavior where if the mouse is outside but enters due to
            // scrolling, then the pan event is triggered.
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
            var allowedDirection = (_a = config === null || config === void 0 ? void 0 : config.allowedDirection) !== null && _a !== void 0 ? _a : 'x';
            if (event.detail.deltaX === 0 && event.detail.deltaY === 0) {
                return;
            }
            accumulatedChange.x += event.detail.deltaX;
            accumulatedChange.y += event.detail.deltaY;
            rafThrottledSetZoomData(function (prev) {
                var x = accumulatedChange.x;
                var y = accumulatedChange.y;
                accumulatedChange.x = 0;
                accumulatedChange.y = 0;
                var movementX = 0;
                var movementY = 0;
                if (allowedDirection === 'x' || allowedDirection === 'xy') {
                    movementX = -x;
                }
                if (allowedDirection === 'y' || allowedDirection === 'xy') {
                    movementY = y;
                }
                if (movementX === 0 && movementY === 0) {
                    return prev;
                }
                return (0, useZoom_utils_1.translateZoom)(prev, { x: movementX, y: movementY }, drawingArea, optionsLookup, allowedDirection);
            });
        });
        return function () {
            wheelHandler.cleanup();
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
        isPanOnWheelEnabled,
        optionsLookup,
        instance,
        setZoomDataCallback,
        store,
        config,
    ]);
};
exports.usePanOnWheel = usePanOnWheel;
