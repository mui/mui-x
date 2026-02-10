"use strict";
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
exports.BarGroup = BarGroup;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var React = require("react");
var useId_1 = require("@mui/utils/useId");
var useStore_1 = require("../../internals/store/useStore");
var useChartDimensions_1 = require("../../internals/plugins/corePlugins/useChartDimensions");
var animation_1 = require("../../internals/animation/animation");
var PathGroup = (0, styles_1.styled)('g')({
    '&[data-faded="true"]': {
        opacity: 0.3,
    },
    '& path': {
        /* The browser must do hit testing to know which element a pointer is interacting with.
         * With many data points, we create many paths causing significant time to be spent in the hit test phase.
         * To fix this issue, we disable pointer events for the descendant paths.
         *
         * Ideally, users should be able to override this in case they need pointer events to be enabled,
         * but it can affect performance negatively, especially with many data points. */
        pointerEvents: 'none',
    },
});
function BarGroup(_a) {
    var skipAnimation = _a.skipAnimation, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, props = __rest(_a, ["skipAnimation", "layout", "xOrigin", "yOrigin"]);
    if (skipAnimation) {
        return (0, jsx_runtime_1.jsx)(PathGroup, __assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(AnimatedGroup, __assign({}, props, { layout: layout, xOrigin: xOrigin, yOrigin: yOrigin }));
}
var AnimatedRect = (0, styles_1.styled)('rect')({
    '@keyframes scaleInX': {
        from: {
            transform: 'scaleX(0)',
        },
        to: {
            transform: 'scaleX(1)',
        },
    },
    '@keyframes scaleInY': {
        from: {
            transform: 'scaleY(0)',
        },
        to: {
            transform: 'scaleY(1)',
        },
    },
    animationDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
    animationFillMode: 'forwards',
    '&[data-orientation="horizontal"]': {
        animationName: 'scaleInX',
    },
    '&[data-orientation="vertical"]': {
        animationName: 'scaleInY',
    },
});
function AnimatedGroup(_a) {
    var children = _a.children, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, props = __rest(_a, ["children", "layout", "xOrigin", "yOrigin"]);
    var store = (0, useStore_1.useStore)();
    var drawingArea = store.use(useChartDimensions_1.selectorChartDrawingArea);
    var clipPathId = (0, useId_1.default)();
    var animateChildren = [];
    if (layout === 'horizontal') {
        animateChildren.push((0, jsx_runtime_1.jsx)(AnimatedRect, { "data-orientation": "horizontal", x: drawingArea.left, width: xOrigin - drawingArea.left, y: drawingArea.top, height: drawingArea.height, style: {
                transformOrigin: "".concat(xOrigin, "px ").concat(drawingArea.top + drawingArea.height / 2, "px"),
            } }, "left"));
        animateChildren.push((0, jsx_runtime_1.jsx)(AnimatedRect, { "data-orientation": "horizontal", x: xOrigin, width: drawingArea.left + drawingArea.width - xOrigin, y: drawingArea.top, height: drawingArea.height, style: {
                transformOrigin: "".concat(xOrigin, "px ").concat(drawingArea.top + drawingArea.height / 2, "px"),
            } }, "right"));
    }
    else {
        animateChildren.push((0, jsx_runtime_1.jsx)(AnimatedRect, { "data-orientation": "vertical", x: drawingArea.left, width: drawingArea.width, y: drawingArea.top, height: yOrigin - drawingArea.top, style: {
                transformOrigin: "".concat(drawingArea.left + drawingArea.width / 2, "px ").concat(yOrigin, "px"),
            } }, "top"));
        animateChildren.push((0, jsx_runtime_1.jsx)(AnimatedRect, { "data-orientation": "vertical", x: drawingArea.left, width: drawingArea.width, y: yOrigin, height: drawingArea.top + drawingArea.height - yOrigin, style: {
                transformOrigin: "".concat(drawingArea.left + drawingArea.width / 2, "px ").concat(yOrigin, "px"),
            } }, "bottom"));
    }
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("clipPath", { id: clipPathId, children: animateChildren }), (0, jsx_runtime_1.jsx)(PathGroup, __assign({ clipPath: "url(#".concat(clipPathId, ")") }, props, { children: children }))] }));
}
