"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampAngle = clampAngle;
exports.clampAngleRad = clampAngleRad;
/**
 * Clamp angle to [0, 360[.
 */
function clampAngle(angle) {
    return ((angle % 360) + 360) % 360;
}
var TWO_PI = 2 * Math.PI;
/** Clamp angle to [0, 2 * Math.PI[. */
function clampAngleRad(angle) {
    return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}
