"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrdinalScale = isOrdinalScale;
exports.isBandScale = isBandScale;
exports.isPointScale = isPointScale;
function isOrdinalScale(scale) {
    return scale.bandwidth !== undefined;
}
function isBandScale(scale) {
    return isOrdinalScale(scale) && scale.paddingOuter !== undefined;
}
function isPointScale(scale) {
    return isOrdinalScale(scale) && !('paddingOuter' in scale);
}
