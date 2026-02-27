"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAngle = getAngle;
/**
 * Calculate the angle between two points in degrees
 */
function getAngle(p1, p2) {
    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    return (angle + 360) % 360;
}
