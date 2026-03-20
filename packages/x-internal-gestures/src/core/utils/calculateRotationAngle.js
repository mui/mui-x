"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRotationAngle = calculateRotationAngle;
var getAngle_1 = require("./getAngle");
/**
 * Calculate the rotation angle between pointers
 * This uses the angle between the first two pointers relative to the centroid
 */
function calculateRotationAngle(pointers) {
    if (pointers.length < 2) {
        return 0;
    }
    // For rotation, we need exactly 2 pointers
    // Use first two since they're most likely the primary pointers
    var p1 = { x: pointers[0].clientX, y: pointers[0].clientY };
    var p2 = { x: pointers[1].clientX, y: pointers[1].clientY };
    return (0, getAngle_1.getAngle)(p1, p2);
}
