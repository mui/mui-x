"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsFineMainPointer = void 0;
exports.useMouseTracker = useMouseTracker;
exports.utcFormatter = utcFormatter;
var React = require("react");
var useMediaQuery_1 = require("@mui/material/useMediaQuery");
var ChartProvider_1 = require("../context/ChartProvider");
/**
 * @deprecated We recommend using vanilla JS to let popper track mouse position.
 */
function useMouseTracker() {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    // Use a ref to avoid rerendering on every mousemove event.
    var _a = React.useState(null), mousePosition = _a[0], setMousePosition = _a[1];
    React.useEffect(function () {
        var moveEndHandler = instance.addInteractionListener('moveEnd', function (event) {
            if (!event.detail.activeGestures.pan) {
                setMousePosition(null);
            }
        });
        var gestureHandler = function (event) {
            setMousePosition({
                x: event.detail.centroid.x,
                y: event.detail.centroid.y,
                height: event.detail.srcEvent.height,
                pointerType: event.detail.srcEvent.pointerType,
            });
        };
        var moveHandler = instance.addInteractionListener('move', gestureHandler);
        var panHandler = instance.addInteractionListener('pan', gestureHandler);
        return function () {
            moveHandler.cleanup();
            panHandler.cleanup();
            moveEndHandler.cleanup();
        };
    }, [instance]);
    return mousePosition;
}
function utcFormatter(v) {
    if (v instanceof Date) {
        return v.toUTCString();
    }
    return v.toLocaleString();
}
// Taken from @mui/x-date-time-pickers
var mainPointerFineMediaQuery = '@media (pointer: fine)';
/**
 * Returns true if the main pointer is fine (e.g. mouse).
 * This is useful for determining how to position tooltips or other UI elements based on the type of input device.
 * @returns true if the main pointer is fine, false otherwise.
 */
var useIsFineMainPointer = function () {
    return (0, useMediaQuery_1.default)(mainPointerFineMediaQuery, { defaultMatches: true });
};
exports.useIsFineMainPointer = useIsFineMainPointer;
