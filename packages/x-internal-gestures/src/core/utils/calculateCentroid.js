"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCentroid = calculateCentroid;
/**
 * Calculate the centroid (average position) of multiple pointers
 */
function calculateCentroid(pointers) {
    if (pointers.length === 0) {
        return { x: 0, y: 0 };
    }
    var sum = pointers.reduce(function (acc, pointer) {
        acc.x += pointer.clientX;
        acc.y += pointer.clientY;
        return acc;
    }, { x: 0, y: 0 });
    return {
        x: sum.x / pointers.length,
        y: sum.y / pointers.length,
    };
}
