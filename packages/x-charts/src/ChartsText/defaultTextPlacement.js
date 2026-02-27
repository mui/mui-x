"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTextAnchor = getDefaultTextAnchor;
exports.getDefaultBaseline = getDefaultBaseline;
var clampAngle_1 = require("../internals/clampAngle");
/**
 * Provide the text-anchor based on the angle between the text and the associated element.
 * - 0 means the element is on top of the text, 180 bellow, and 90 on the right of the text.
 * @param {number} angle The angle between the text and the element.
 * @returns
 */
function getDefaultTextAnchor(angle) {
    var adjustedAngle = (0, clampAngle_1.clampAngle)(angle);
    if (adjustedAngle <= 30 || adjustedAngle >= 330) {
        // +/-30° around 0°
        return 'middle';
    }
    if (adjustedAngle <= 210 && adjustedAngle >= 150) {
        // +/-30° around 180°
        return 'middle';
    }
    if (adjustedAngle <= 180) {
        return 'end';
    }
    return 'start';
}
function getDefaultBaseline(angle) {
    var adjustedAngle = (0, clampAngle_1.clampAngle)(angle);
    if (adjustedAngle <= 30 || adjustedAngle >= 330) {
        // +/-60° around 0°
        return 'hanging';
    }
    if (adjustedAngle <= 210 && adjustedAngle >= 150) {
        // +/-60° around 180°
        return 'auto';
    }
    return 'central';
}
