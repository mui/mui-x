"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurveFactory = getCurveFactory;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
function getCurveFactory(curveType) {
    switch (curveType) {
        case 'catmullRom':
            return d3_shape_1.curveCatmullRom.alpha(0.5);
        case 'linear':
            return d3_shape_1.curveLinear;
        case 'monotoneX':
            return d3_shape_1.curveMonotoneX;
        case 'monotoneY':
            return d3_shape_1.curveMonotoneY;
        case 'natural':
            return d3_shape_1.curveNatural;
        case 'step':
            return d3_shape_1.curveStep;
        case 'stepBefore':
            return d3_shape_1.curveStepBefore;
        case 'stepAfter':
            return d3_shape_1.curveStepAfter;
        case 'bumpY':
            return d3_shape_1.curveBumpY;
        case 'bumpX':
            return d3_shape_1.curveBumpX;
        default:
            return d3_shape_1.curveMonotoneX;
    }
}
