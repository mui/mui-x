"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurfacePoint = getSurfacePoint;
/**
 * Transform mouse event position to coordinates inside the SVG surface or the layer container.
 * @param element The SVG surface or the layer container
 * @param event The mouseEvent to transform
 */
function getSurfacePoint(element, event) {
    var rect = element.getBoundingClientRect();
    var style = getComputedStyle(element);
    var transform = new DOMMatrix(style.transform);
    var point = new DOMPoint(event.clientX - rect.left, event.clientY - rect.top);
    return point.matrixTransform(transform.inverse());
}
