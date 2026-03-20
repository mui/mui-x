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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxisZoomSliderTrack = ChartsAxisZoomSliderTrack;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var styles_1 = require("@mui/material/styles");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var system_1 = require("@mui/system");
var clsx_1 = require("clsx");
var zoom_utils_1 = require("./zoom-utils");
var chartsAxisZoomSliderTrackClasses_1 = require("./chartsAxisZoomSliderTrackClasses");
var ZoomSliderTrack = (0, styles_1.styled)('rect', {
    slot: 'internal',
    shouldForwardProp: function (prop) {
        return (0, system_1.shouldForwardProp)(prop) && prop !== 'axisDirection' && prop !== 'isSelecting';
    },
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({ fill: (theme.vars || theme).palette.grey[300] }, theme.applyStyles('dark', {
        fill: (theme.vars || theme).palette.grey[800],
    })), { cursor: 'pointer', variants: [
            {
                props: { axisDirection: 'x', isSelecting: true },
                style: {
                    cursor: 'ew-resize',
                },
            },
            {
                props: { axisDirection: 'y', isSelecting: true },
                style: {
                    cursor: 'ns-resize',
                },
            },
        ] }));
});
function ChartsAxisZoomSliderTrack(_a) {
    var axisId = _a.axisId, axisDirection = _a.axisDirection, reverse = _a.reverse, onSelectStart = _a.onSelectStart, onSelectEnd = _a.onSelectEnd, other = __rest(_a, ["axisId", "axisDirection", "reverse", "onSelectStart", "onSelectEnd"]);
    var ref = React.useRef(null);
    var instance = (0, internals_1.useChartsContext)().instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var store = (0, internals_1.useStore)();
    var _b = React.useState(false), isSelecting = _b[0], setIsSelecting = _b[1];
    var classes = (0, chartsAxisZoomSliderTrackClasses_1.useUtilityClasses)({ axisDirection: axisDirection });
    var onPointerDown = function onPointerDown(event) {
        var rect = ref.current;
        var element = chartsLayerContainerRef.current;
        if (!rect || !element) {
            return;
        }
        var pointerDownPoint = (0, internals_1.getChartPoint)(element, event);
        var zoomFromPointerDown = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, pointerDownPoint);
        if (zoomFromPointerDown === null) {
            return;
        }
        var onPointerMove = (0, rafThrottle_1.rafThrottle)(function onPointerMove(pointerMoveEvent) {
            var pointerMovePoint = (0, internals_1.getChartPoint)(element, pointerMoveEvent);
            var zoomFromPointerMove = (0, zoom_utils_1.calculateZoomFromPoint)(store.state, axisId, pointerMovePoint);
            if (zoomFromPointerMove === null) {
                return;
            }
            var zoomOptions = (0, internals_1.selectorChartAxisZoomOptionsLookup)(store.state, axisId);
            instance.setAxisZoomData(axisId, function (prevZoomData) {
                if (zoomFromPointerMove > zoomFromPointerDown) {
                    var end_1 = (0, zoom_utils_1.calculateZoomEnd)(zoomFromPointerMove, __assign(__assign({}, prevZoomData), { start: zoomFromPointerDown }), zoomOptions);
                    /* If the starting point is too close to the end that minSpan wouldn't be respected, we need to update the
                     * start point. */
                    var start_1 = (0, zoom_utils_1.calculateZoomStart)(zoomFromPointerDown, __assign(__assign({}, prevZoomData), { start: zoomFromPointerDown, end: end_1 }), zoomOptions);
                    return __assign(__assign({}, prevZoomData), { start: start_1, end: end_1 });
                }
                var start = (0, zoom_utils_1.calculateZoomStart)(zoomFromPointerMove, __assign(__assign({}, prevZoomData), { end: zoomFromPointerDown }), zoomOptions);
                /* If the starting point is too close to the start that minSpan wouldn't be respected, we need to update the
                 * start point. */
                var end = (0, zoom_utils_1.calculateZoomEnd)(zoomFromPointerDown, __assign(__assign({}, prevZoomData), { start: start, end: zoomFromPointerDown }), zoomOptions);
                return __assign(__assign({}, prevZoomData), { start: start, end: end });
            });
        });
        var onPointerUp = function onPointerUp(pointerUpEvent) {
            rect.releasePointerCapture(pointerUpEvent.pointerId);
            rect.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            setIsSelecting(false);
            onSelectEnd === null || onSelectEnd === void 0 ? void 0 : onSelectEnd();
        };
        event.preventDefault();
        event.stopPropagation();
        rect.setPointerCapture(event.pointerId);
        document.addEventListener('pointerup', onPointerUp);
        rect.addEventListener('pointermove', onPointerMove);
        onSelectStart === null || onSelectStart === void 0 ? void 0 : onSelectStart();
        setIsSelecting(true);
    };
    return ((0, jsx_runtime_1.jsx)(ZoomSliderTrack, __assign({ ref: ref, onPointerDown: onPointerDown, axisDirection: axisDirection, isSelecting: isSelecting }, other, { className: (0, clsx_1.default)(classes.background, other.className) })));
}
