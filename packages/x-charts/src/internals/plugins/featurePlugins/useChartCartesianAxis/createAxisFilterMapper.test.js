"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var createAxisFilterMapper_1 = require("./createAxisFilterMapper");
var getScale_1 = require("../../../getScale");
describe('createDiscreteScaleGetAxisFilter', function () {
    it("should not include elements that aren't at least partially visible", function () {
        var axisData = ['I0', 'I1', 'I2', 'I3', 'I4'];
        var filter = (0, createAxisFilterMapper_1.createDiscreteScaleGetAxisFilter)(axisData, 20, 80, 'x');
        expect(filter({ x: 'I0', y: null }, 0)).toBe(false); // index 0, outside range
        expect(filter({ x: 'I1', y: null }, 1)).toBe(true); // index 1, within range
        expect(filter({ x: 'I2', y: null }, 2)).toBe(true); // index 2, within range
        expect(filter({ x: 'I3', y: null }, 3)).toBe(true); // index 3, within range
        expect(filter({ x: 'I4', y: null }, 4)).toBe(false); // index 4, outside range
    });
    it('should include elements if they are partially visible', function () {
        var axisData = ['I0', 'I1', 'I2', 'I3'];
        var filter = (0, createAxisFilterMapper_1.createDiscreteScaleGetAxisFilter)(axisData, 24, 76, 'y');
        expect(filter({ x: null, y: 'I0' }, 0)).toBe(true);
        expect(filter({ x: null, y: 'I1' }, 1)).toBe(true);
        expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
        expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
    });
    it('should include elements if they are partially visible (another case)', function () {
        var axisData = ['I0', 'I1', 'I2', 'I3'];
        var filter = (0, createAxisFilterMapper_1.createDiscreteScaleGetAxisFilter)(axisData, 51, 76, 'y');
        expect(filter({ x: null, y: 'I0' }, 0)).toBe(false);
        expect(filter({ x: null, y: 'I1' }, 1)).toBe(false);
        expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
        expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
    });
    it('should include all elements when there is no zoom', function () {
        var axisData = ['I0', 'I1', 'I2', 'I3', 'I4', 'I5'];
        var filter = (0, createAxisFilterMapper_1.createDiscreteScaleGetAxisFilter)(axisData, 0, 100, 'y');
        expect(filter({ x: null, y: 'I0' }, 0)).toBe(true);
        expect(filter({ x: null, y: 'I1' }, 1)).toBe(true);
        expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
        expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
        expect(filter({ x: null, y: 'I4' }, 4)).toBe(true);
        expect(filter({ x: null, y: 'I5' }, 5)).toBe(true);
    });
});
describe('createContinuousScaleGetAxisFilter', function () {
    describe('linear scale', function () {
        var scale = (0, getScale_1.getScale)('linear', [0, 100], [0, 100]).nice();
        it('should filter values within zoom range', function () {
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 20, 80, 'x', undefined);
            // Test values within range
            expect(filter({ x: 30, y: null }, 0)).toBe(true);
            expect(filter({ x: 50, y: null }, 0)).toBe(true);
            expect(filter({ x: 70, y: null }, 0)).toBe(true);
            // Test values outside range
            expect(filter({ x: 10, y: null }, 0)).toBe(false);
            expect(filter({ x: 90, y: null }, 0)).toBe(false);
        });
        it('should handle edge values at zoom boundaries', function () {
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 25, 75, 'x', undefined);
            // Values at boundaries should be included
            expect(filter({ x: 25, y: null }, 0)).toBe(true);
            expect(filter({ x: 75, y: null }, 0)).toBe(true);
        });
        it('should handle null values', function () {
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 20, 80, 'x', undefined);
            // Null values should be ignored (return true)
            expect(filter({ x: null, y: null }, 0)).toBe(true);
        });
        it('should work with y direction', function () {
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 30, 70, 'y', undefined);
            expect(filter({ x: null, y: 40 }, 0)).toBe(true);
            expect(filter({ x: null, y: 60 }, 0)).toBe(true);
            expect(filter({ x: null, y: 20 }, 0)).toBe(false);
            expect(filter({ x: null, y: 80 }, 0)).toBe(false);
        });
    });
    describe('time scale', function () {
        it('should filter date values correctly', function () {
            var startDate = new Date('2023-01-01').getTime();
            var endDate = new Date('2023-12-31').getTime();
            var scale = (0, d3_scale_1.scaleTime)([startDate, endDate], [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 25, 75, 'x', undefined);
            var midYearDate = new Date('2023-06-15').getTime();
            var earlyYearDate = new Date('2023-02-01').getTime();
            var lateYearDate = new Date('2023-11-01').getTime();
            expect(filter({ x: midYearDate, y: null }, 0)).toBe(true);
            expect(filter({ x: earlyYearDate, y: null }, 0)).toBe(false);
            expect(filter({ x: lateYearDate, y: null }, 0)).toBe(false);
        });
    });
    describe('fallback to axis data', function () {
        it('should use axis data when value direction is missing', function () {
            var axisData = [10, 20, 30, 40, 50];
            var extrema = [10, 50];
            var scale = (0, d3_scale_1.scaleLinear)(extrema, [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 40, 80, 'x', axisData);
            // When x value is missing, it should use axisData[dataIndex]
            expect(filter({ x: null, y: null }, 0)).toBe(false); // axisData[0] = 10, outside range
            expect(filter({ x: null, y: null }, 2)).toBe(true); // axisData[2] = 30, within range
            expect(filter({ x: null, y: null }, 4)).toBe(false); // axisData[4] = 50, outside range
        });
        it('should handle out of range index gracefully', function () {
            var axisData = [10, 20, 30];
            var extrema = [10, 30];
            var scale = (0, d3_scale_1.scaleLinear)(extrema, [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 20, 80, 'x', axisData);
            // Out of range index should return true (ignore)
            expect(filter({ x: null, y: null }, 5)).toBe(true);
            expect(filter({ x: null, y: null }, -1)).toBe(true);
        });
    });
    describe('edge cases', function () {
        it('should handle full zoom range (0-100)', function () {
            var extrema = [-50, 50];
            var scale = (0, d3_scale_1.scaleLinear)(extrema, [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 0, 100, 'x', undefined);
            expect(filter({ x: -50.1, y: null }, 0)).toBe(false);
            expect(filter({ x: -50, y: null }, 0)).toBe(true);
            expect(filter({ x: 0, y: null }, 0)).toBe(true);
            expect(filter({ x: 50, y: null }, 0)).toBe(true);
            expect(filter({ x: 50.1, y: null }, 0)).toBe(false);
        });
        it('should handle very narrow zoom range', function () {
            var extrema = [0, 100];
            var scale = (0, d3_scale_1.scaleLinear)(extrema, [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 49, 51, 'x', undefined);
            expect(filter({ x: 48, y: null }, 0)).toBe(false);
            expect(filter({ x: 50, y: null }, 0)).toBe(true);
            expect(filter({ x: 52, y: null }, 0)).toBe(false);
        });
        it('should handle negative extrema values', function () {
            var extrema = [-50, 50];
            var scale = (0, d3_scale_1.scaleLinear)(extrema, [0, 100]).nice();
            var filter = (0, createAxisFilterMapper_1.createContinuousScaleGetAxisFilter)(scale.domain(), 25, 75, 'x', undefined);
            expect(filter({ x: 0, y: null }, 0)).toBe(true);
            expect(filter({ x: -40, y: null }, 0)).toBe(false);
            expect(filter({ x: 40, y: null }, 0)).toBe(false);
        });
    });
});
