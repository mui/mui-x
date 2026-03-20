"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartPoint = getChartPoint;
/**
 * Transform mouse event position to coordinates relative to the layer container.
 * (0, 0) is the top-left corner of the layer container.
 * @param element The the layer container
 * @param event The mouseEvent to transform
 */
function getChartPoint(element, event) {
    var rect = element.getBoundingClientRect();
    var style = getComputedStyle(element);
    var transform = new DOMMatrix(style.transform);
    var point = new DOMPoint(event.clientX - rect.left, event.clientY - rect.top);
    return point.matrixTransform(transform.inverse());
}
