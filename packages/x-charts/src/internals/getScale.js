"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScale = getScale;
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var scales_1 = require("./scales");
function getScale(scaleType, domain, range) {
    switch (scaleType) {
        case 'log':
            return (0, d3_scale_1.scaleLog)(domain, range);
        case 'pow':
            return (0, d3_scale_1.scalePow)(domain, range);
        case 'sqrt':
            return (0, d3_scale_1.scaleSqrt)(domain, range);
        case 'time':
            return (0, d3_scale_1.scaleTime)(domain, range);
        case 'utc':
            return (0, d3_scale_1.scaleUtc)(domain, range);
        case 'symlog':
            return (0, scales_1.scaleSymlog)(domain, range);
        default:
            return (0, d3_scale_1.scaleLinear)(domain, range);
    }
}
