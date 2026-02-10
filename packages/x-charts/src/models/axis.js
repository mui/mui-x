"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBandScaleConfig = isBandScaleConfig;
exports.isPointScaleConfig = isPointScaleConfig;
exports.isContinuousScaleConfig = isContinuousScaleConfig;
exports.isSymlogScaleConfig = isSymlogScaleConfig;
function isBandScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'band';
}
function isPointScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'point';
}
function isContinuousScaleConfig(scaleConfig) {
    return scaleConfig.scaleType !== 'point' && scaleConfig.scaleType !== 'band';
}
function isSymlogScaleConfig(scaleConfig) {
    return scaleConfig.scaleType === 'symlog';
}
