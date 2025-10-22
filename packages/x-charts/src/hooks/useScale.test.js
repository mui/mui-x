"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var useScale_1 = require("./useScale");
describe('getValueToPositionMapper', function () {
    it('returns a function that maps values to their position for ordinal scales', function () {
        var scale = (0, d3_scale_1.scaleBand)(['A', 'B', 'C'], [0, 1]);
        var mapper = (0, useScale_1.getValueToPositionMapper)(scale);
        expect(mapper('B')).toBeCloseTo(0.5);
    });
    it('returns a function that maps values to their position for continuous scales', function () {
        var scale = (0, d3_scale_1.scaleLinear)([0, 10], [0, 1]);
        var mapper = (0, useScale_1.getValueToPositionMapper)(scale);
        expect(mapper(5)).toBeCloseTo(0.5);
    });
    it('returns a function that returns NaN for continuous scales whose domain has zero size and the value is outside the domain', function () {
        var scale = (0, d3_scale_1.scaleLinear)([10, 10], [0, 1]);
        var mapper = (0, useScale_1.getValueToPositionMapper)(scale);
        expect(mapper(11)).toBeNaN();
        expect(mapper(5)).toBeNaN();
    });
    it('returns a function that returns applies the scale for continuous scales whose domain has zero size and the value is inside the domain', function () {
        var scale = (0, d3_scale_1.scaleLinear)([10, 10], [0, 1]);
        var mapper = (0, useScale_1.getValueToPositionMapper)(scale);
        expect(mapper(10)).to.eq(0.5);
    });
});
