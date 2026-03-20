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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsBrushOverlay = ChartsBrushOverlay;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var ChartsBrushOverlay_classes_1 = require("./ChartsBrushOverlay.classes");
var useChartDimensions_1 = require("../internals/plugins/corePlugins/useChartDimensions");
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
var useStore_1 = require("../internals/store/useStore");
function BrushRect(props) {
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ className: ChartsBrushOverlay_classes_1.brushOverlayClasses.rect, strokeWidth: 1, fillOpacity: 0.2, pointerEvents: 'none' }, props)));
}
/**
 * Component that renders visual feedback during brush interaction
 */
function ChartsBrushOverlay(props) {
    var store = (0, useStore_1.useStore)();
    var drawingArea = store.use(useChartDimensions_1.selectorChartDrawingArea);
    var theme = (0, styles_1.useTheme)();
    var brushStartX = store.use(useChartBrush_1.selectorBrushStartX);
    var brushStartY = store.use(useChartBrush_1.selectorBrushStartY);
    var brushCurrentX = store.use(useChartBrush_1.selectorBrushCurrentX);
    var brushCurrentY = store.use(useChartBrush_1.selectorBrushCurrentY);
    var brushConfig = store.use(useChartBrush_1.selectorBrushConfig);
    if (brushStartX === null ||
        brushStartY === null ||
        brushCurrentX === null ||
        brushCurrentY === null) {
        return null;
    }
    var left = drawingArea.left, top = drawingArea.top, width = drawingArea.width, height = drawingArea.height;
    // Clamp coordinates to drawing area
    var clampX = function (x) { return Math.max(left, Math.min(left + width, x)); };
    var clampY = function (y) { return Math.max(top, Math.min(top + height, y)); };
    var startX = clampX(brushStartX);
    var startY = clampY(brushStartY);
    var currentX = clampX(brushCurrentX);
    var currentY = clampY(brushCurrentY);
    var rectColor = theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white;
    // For scatter charts, show only the rectangle without guide lines
    if (brushConfig === 'xy') {
        var rectWidth_1 = currentX - startX;
        var rectHeight = currentY - startY;
        return ((0, jsx_runtime_1.jsx)("g", { className: (0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.x, ChartsBrushOverlay_classes_1.brushOverlayClasses.y), children: (0, jsx_runtime_1.jsx)(BrushRect, __assign({ fill: rectColor, x: rectWidth_1 >= 0 ? startX : currentX, y: rectHeight >= 0 ? startY : currentY, width: Math.abs(rectWidth_1), height: Math.abs(rectHeight) }, props)) }));
    }
    if (brushConfig === 'y') {
        var minY = Math.min(startY, currentY);
        var maxY = Math.max(startY, currentY);
        var rectHeight = maxY - minY;
        return ((0, jsx_runtime_1.jsx)("g", { className: (0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.y), children: (0, jsx_runtime_1.jsx)(BrushRect, __assign({ fill: rectColor, x: left, y: minY, width: width, height: rectHeight }, props)) }));
    }
    var minX = Math.min(startX, currentX);
    var maxX = Math.max(startX, currentX);
    var rectWidth = maxX - minX;
    return ((0, jsx_runtime_1.jsx)("g", { className: (0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.x), children: (0, jsx_runtime_1.jsx)(BrushRect, __assign({ fill: rectColor, x: minX, y: top, width: rectWidth, height: height }, props)) }));
}
