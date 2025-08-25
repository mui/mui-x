"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBandScaleConfig = isBandScaleConfig;
exports.isPointScaleConfig = isPointScaleConfig;
exports.isSymlogScaleConfig = isSymlogScaleConfig;
function isBandScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'band';
}
function isPointScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'point';
}
function isSymlogScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'symlog';
}
