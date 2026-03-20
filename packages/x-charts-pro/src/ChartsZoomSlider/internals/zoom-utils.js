"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateZoomFromPoint = calculateZoomFromPoint;
exports.calculateZoomFromPointImpl = calculateZoomFromPointImpl;
exports.calculateZoomStart = calculateZoomStart;
exports.calculateZoomEnd = calculateZoomEnd;
var internals_1 = require("@mui/x-charts/internals");
function calculateZoomFromPoint(state, axisId, point) {
    var axis = (0, internals_1.selectorChartRawAxis)(state, axisId);
    if (!axis) {
        return null;
    }
    return calculateZoomFromPointImpl((0, internals_1.selectorChartDrawingArea)(state), axis, (0, internals_1.selectorChartAxisZoomOptionsLookup)(state, axisId), point);
}
function calculateZoomFromPointImpl(drawingArea, axis, zoomOptions, point) {
    var left = drawingArea.left, top = drawingArea.top, height = drawingArea.height, width = drawingArea.width;
    var minStart = zoomOptions.minStart, maxEnd = zoomOptions.maxEnd;
    var axisDirection = axis.position === 'right' || axis.position === 'left' ? 'y' : 'x';
    var range = maxEnd - minStart;
    var pointerZoom;
    if (axisDirection === 'x') {
        pointerZoom = ((point.x - left) / width) * range;
    }
    else {
        pointerZoom = ((top + height - point.y) / height) * range;
    }
    if (axis.reverse) {
        pointerZoom = maxEnd - pointerZoom;
    }
    else {
        pointerZoom += minStart;
    }
    return pointerZoom;
}
function calculateZoomStart(newStart, currentZoom, options) {
    var minStart = options.minStart, minSpan = options.minSpan, maxSpan = options.maxSpan;
    return Math.max(minStart, currentZoom.end - maxSpan, Math.min(currentZoom.end - minSpan, newStart));
}
function calculateZoomEnd(newEnd, currentZoom, options) {
    var maxEnd = options.maxEnd, minSpan = options.minSpan, maxSpan = options.maxSpan;
    return Math.min(maxEnd, currentZoom.start + maxSpan, Math.max(currentZoom.start + minSpan, newEnd));
}
