"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsBrushOverlay = ChartsBrushOverlay;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var ChartsBrushOverlay_classes_1 = require("./ChartsBrushOverlay.classes");
var useChartDimensions_1 = require("../internals/plugins/corePlugins/useChartDimensions");
var useChartBrush_1 = require("../internals/plugins/featurePlugins/useChartBrush");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
function BrushRect(props) {
    return (<rect className={ChartsBrushOverlay_classes_1.brushOverlayClasses.rect} strokeWidth={1} fillOpacity={0.2} pointerEvents={'none'} {...props}/>);
}
/**
 * Component that renders visual feedback during brush interaction
 */
function ChartsBrushOverlay(props) {
    var store = (0, useStore_1.useStore)();
    var drawingArea = (0, useSelector_1.useSelector)(store, useChartDimensions_1.selectorChartDrawingArea);
    var theme = (0, styles_1.useTheme)();
    var brushStartX = (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushStartX);
    var brushStartY = (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushStartY);
    var brushCurrentX = (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushCurrentX);
    var brushCurrentY = (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushCurrentY);
    var brushConfig = (0, useSelector_1.useSelector)(store, useChartBrush_1.selectorBrushConfig);
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
        return (<g className={(0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.x, ChartsBrushOverlay_classes_1.brushOverlayClasses.y)}>
        <BrushRect fill={rectColor} x={rectWidth_1 >= 0 ? startX : currentX} y={rectHeight >= 0 ? startY : currentY} width={Math.abs(rectWidth_1)} height={Math.abs(rectHeight)} {...props}/>
      </g>);
    }
    if (brushConfig === 'y') {
        var minY = Math.min(startY, currentY);
        var maxY = Math.max(startY, currentY);
        var rectHeight = maxY - minY;
        return (<g className={(0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.y)}>
        <BrushRect fill={rectColor} x={left} y={minY} width={width} height={rectHeight} {...props}/>
      </g>);
    }
    var minX = Math.min(startX, currentX);
    var maxX = Math.max(startX, currentX);
    var rectWidth = maxX - minX;
    return (<g className={(0, clsx_1.default)(ChartsBrushOverlay_classes_1.brushOverlayClasses.root, ChartsBrushOverlay_classes_1.brushOverlayClasses.x)}>
      <BrushRect fill={rectColor} x={minX} y={top} width={rectWidth} height={height} {...props}/>
    </g>);
}
