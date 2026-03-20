"use strict";
'use client';
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appearingMaskClasses = void 0;
exports.AppearingMask = AppearingMask;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var animation_1 = require("../internals/animation/animation");
var cleanId_1 = require("../internals/cleanId");
var hooks_1 = require("../hooks");
exports.appearingMaskClasses = (0, generateUtilityClasses_1.default)('MuiAppearingMask', ['animate']);
var AnimatedRect = (0, styles_1.styled)('rect', {
    slot: 'internal',
    shouldForwardProp: undefined,
})((_a = {
        animationName: 'animate-width',
        animationTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
        animationDuration: '0s'
    },
    _a["&.".concat(exports.appearingMaskClasses.animate)] = {
        animationDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
    },
    _a['@keyframes animate-width'] = {
        from: { width: 0 },
    },
    _a));
/**
 * @ignore - internal component.
 */
function AppearingMask(props) {
    var drawingArea = (0, hooks_1.useDrawingArea)();
    var chartId = (0, hooks_1.useChartId)();
    var clipId = (0, cleanId_1.cleanId)("".concat(chartId, "-").concat(props.seriesId));
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("clipPath", { id: clipId, children: (0, jsx_runtime_1.jsx)(AnimatedRect, { className: props.skipAnimation ? '' : exports.appearingMaskClasses.animate, x: 0, y: 0, width: drawingArea.left + drawingArea.width + drawingArea.right, height: drawingArea.top + drawingArea.height + drawingArea.bottom }) }), (0, jsx_runtime_1.jsx)("g", { clipPath: "url(#".concat(clipId, ")"), children: props.children })] }));
}
