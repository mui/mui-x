"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSVGPoint = getSVGPoint;
/**
 * Transform mouse event position to coordinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
function getSVGPoint(svg, event) {
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}
