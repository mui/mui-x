"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sankeyLinkHorizontal = sankeyLinkHorizontal;
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
function horizontalSource(d) {
    return [d.source.x1, d.y0];
}
function horizontalTarget(d) {
    return [d.target.x0, d.y1];
}
function sankeyLinkHorizontal() {
    return (0, d3_shape_1.linkHorizontal)()
        .source(horizontalSource)
        .target(horizontalTarget);
}
