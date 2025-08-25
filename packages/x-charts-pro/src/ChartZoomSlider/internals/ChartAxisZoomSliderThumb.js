"use strict";
'use client';
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
exports.ChartAxisZoomSliderThumb = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var clsx_1 = require("clsx");
var chartAxisZoomSliderThumbClasses_1 = require("./chartAxisZoomSliderThumbClasses");
var Rect = (0, styles_1.styled)('rect')(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(chartAxisZoomSliderThumbClasses_1.chartAxisZoomSliderThumbClasses.root)] = {
            fill: theme.palette.mode === 'dark'
                ? (theme.vars || theme).palette.grey[300]
                : (theme.vars || theme).palette.common.white,
            stroke: theme.palette.mode === 'dark'
                ? (theme.vars || theme).palette.grey[600]
                : (theme.vars || theme).palette.grey[500],
        },
        _b["&.".concat(chartAxisZoomSliderThumbClasses_1.chartAxisZoomSliderThumbClasses.horizontal)] = {
            cursor: 'ew-resize',
        },
        _b["&.".concat(chartAxisZoomSliderThumbClasses_1.chartAxisZoomSliderThumbClasses.vertical)] = {
            cursor: 'ns-resize',
        },
        _b);
});
/**
 * Renders the zoom slider thumb, which is responsible for resizing the zoom range.
 * @internal
 */
exports.ChartAxisZoomSliderThumb = React.forwardRef(function ChartAxisZoomSliderThumb(_a, forwardedRef) {
    var className = _a.className, onMove = _a.onMove, orientation = _a.orientation, placement = _a.placement, _b = _a.rx, rx = _b === void 0 ? 4 : _b, _c = _a.ry, ry = _c === void 0 ? 4 : _c, rest = __rest(_a, ["className", "onMove", "orientation", "placement", "rx", "ry"]);
    var classes = (0, chartAxisZoomSliderThumbClasses_1.useUtilityClasses)({ onMove: onMove, orientation: orientation, placement: placement });
    var thumbRef = React.useRef(null);
    var ref = (0, useForkRef_1.default)(thumbRef, forwardedRef);
    var onMoveEvent = (0, useEventCallback_1.default)(onMove);
    React.useEffect(function () {
        var thumb = thumbRef.current;
        if (!thumb) {
            return;
        }
        var onPointerMove = (0, rafThrottle_1.rafThrottle)(function (event) {
            onMoveEvent(event);
        });
        var onPointerUp = function () {
            thumb.removeEventListener('pointermove', onPointerMove);
            thumb.removeEventListener('pointerup', onPointerUp);
        };
        var onPointerDown = function (event) {
            // Prevent text selection when dragging the thumb
            event.preventDefault();
            event.stopPropagation();
            thumb.setPointerCapture(event.pointerId);
            thumb.addEventListener('pointerup', onPointerUp);
            thumb.addEventListener('pointermove', onPointerMove);
        };
        thumb.addEventListener('pointerdown', onPointerDown);
        // eslint-disable-next-line consistent-return
        return function () {
            thumb.removeEventListener('pointerdown', onPointerDown);
            onPointerMove.clear();
        };
    }, [onMoveEvent, orientation]);
    return <Rect className={(0, clsx_1.default)(classes.root, className)} ref={ref} rx={rx} ry={ry} {...rest}/>;
});
