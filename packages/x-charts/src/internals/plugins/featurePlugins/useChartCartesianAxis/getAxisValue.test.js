"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var vitest_1 = require("vitest");
var getAxisValue_1 = require("./getAxisValue");
(0, vitest_1.describe)('getAxisValue', function () {
    it('returns the inverted value when the scale is ordinal', function () {
        var scale = (0, d3_scale_1.scaleBand)();
        expect((0, getAxisValue_1.getAxisValue)(scale, ['A', 'B', 'C', 'D'], 600, 2)).to.eq('C');
    });
    it('returns the inverted value when the scale is continuous', function () {
        var scale = (0, d3_scale_1.scaleLinear)([0, 100], [0, 1000]);
        expect((0, getAxisValue_1.getAxisValue)(scale, [], 500, null)).to.eq(50);
    });
    it('returns `null` when the scale is continuous and its domain is not finite', function () {
        var scale = (0, d3_scale_1.scaleLinear)([Infinity, -Infinity]);
        expect((0, getAxisValue_1.getAxisValue)(scale, [], 500, null)).to.eq(null);
    });
});
