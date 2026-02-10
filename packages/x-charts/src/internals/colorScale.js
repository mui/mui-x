"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequentialColorScale = getSequentialColorScale;
exports.getOrdinalColorScale = getOrdinalColorScale;
exports.getColorScale = getColorScale;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
function getSequentialColorScale(config) {
    var _a, _b;
    if (config.type === 'piecewise') {
        return (0, d3_scale_1.scaleThreshold)(config.thresholds, config.colors);
    }
    return (0, d3_scale_1.scaleSequential)([(_a = config.min) !== null && _a !== void 0 ? _a : 0, (_b = config.max) !== null && _b !== void 0 ? _b : 100], config.color);
}
function getOrdinalColorScale(config) {
    var _a, _b;
    if (config.values) {
        return (0, d3_scale_1.scaleOrdinal)(config.values, config.colors).unknown((_a = config.unknownColor) !== null && _a !== void 0 ? _a : null);
    }
    return (0, d3_scale_1.scaleOrdinal)(config.colors.map(function (_, index) { return index; }), config.colors).unknown((_b = config.unknownColor) !== null && _b !== void 0 ? _b : null);
}
function getColorScale(config) {
    return config.type === 'ordinal' ? getOrdinalColorScale(config) : getSequentialColorScale(config);
}
