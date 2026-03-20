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
exports.ChartsAxisZoomSliderThumb = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var rafThrottle_1 = require("@mui/x-internals/rafThrottle");
var clsx_1 = require("clsx");
var chartsAxisZoomSliderThumbClasses_1 = require("./chartsAxisZoomSliderThumbClasses");
var Rect = (0, styles_1.styled)('rect', {
    slot: 'internal',
    shouldForwardProp: undefined,
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&.".concat(chartsAxisZoomSliderThumbClasses_1.chartsAxisZoomSliderThumbClasses.root)] = __assign({ fill: (theme.vars || theme).palette.common.white, stroke: (theme.vars || theme).palette.grey[500] }, theme.applyStyles('dark', {
            fill: (theme.vars || theme).palette.grey[300],
            stroke: (theme.vars || theme).palette.grey[600],
        })),
        _b["&.".concat(chartsAxisZoomSliderThumbClasses_1.chartsAxisZoomSliderThumbClasses.horizontal)] = {
            cursor: 'ew-resize',
        },
        _b["&.".concat(chartsAxisZoomSliderThumbClasses_1.chartsAxisZoomSliderThumbClasses.vertical)] = {
            cursor: 'ns-resize',
        },
        _b);
});
function preventDefault(event) {
    event.preventDefault();
}
/**
 * Renders the zoom slider thumb, which is responsible for resizing the zoom range.
 * @internal
 */
exports.ChartsAxisZoomSliderThumb = React.forwardRef(function ChartsAxisZoomSliderThumb(_a, forwardedRef) {
    var className = _a.className, onMove = _a.onMove, orientation = _a.orientation, placement = _a.placement, _b = _a.rx, rx = _b === void 0 ? 4 : _b, _c = _a.ry, ry = _c === void 0 ? 4 : _c, other = __rest(_a, ["className", "onMove", "orientation", "placement", "rx", "ry"]);
    var classes = (0, chartsAxisZoomSliderThumbClasses_1.useUtilityClasses)({ onMove: onMove, orientation: orientation, placement: placement });
    var thumbRef = React.useRef(null);
    var ref = (0, useForkRef_1.default)(thumbRef, forwardedRef);
    var onMoveEvent = (0, useEventCallback_1.default)(onMove);
    React.useEffect(function () {
        var thumb = thumbRef.current;
        if (!thumb) {
            return function () { };
        }
        // Prevent scrolling on touch devices when dragging the thumb
        thumb.addEventListener('touchmove', preventDefault, { passive: false });
        var onPointerMove = (0, rafThrottle_1.rafThrottle)(function (event) {
            onMoveEvent(event);
        });
        var onPointerEnd = function (event) {
            thumb.removeEventListener('pointermove', onPointerMove);
            thumb.removeEventListener('pointerup', onPointerEnd);
            thumb.removeEventListener('pointercancel', onPointerEnd);
            thumb.releasePointerCapture(event.pointerId);
        };
        var onPointerDown = function (event) {
            // Prevent text selection when dragging the thumb
            event.preventDefault();
            event.stopPropagation();
            thumb.setPointerCapture(event.pointerId);
            thumb.addEventListener('pointermove', onPointerMove);
            thumb.addEventListener('pointercancel', onPointerEnd);
            thumb.addEventListener('pointerup', onPointerEnd);
        };
        thumb.addEventListener('pointerdown', onPointerDown);
        return function () {
            thumb.removeEventListener('pointerdown', onPointerDown);
            thumb.removeEventListener('pointermove', onPointerMove);
            thumb.removeEventListener('pointercancel', onPointerEnd);
            thumb.removeEventListener('pointerup', onPointerEnd);
            thumb.removeEventListener('touchmove', preventDefault);
            onPointerMove.clear();
        };
    }, [onMoveEvent, orientation]);
    return (0, jsx_runtime_1.jsx)(Rect, __assign({ className: (0, clsx_1.default)(classes.root, className), ref: ref, rx: rx, ry: ry }, other));
});
