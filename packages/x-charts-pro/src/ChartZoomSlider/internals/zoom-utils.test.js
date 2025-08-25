"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zoom_utils_1 = require("./zoom-utils");
describe('Zoom Utils', function () {
    describe('calculateZoomStart', function () {
        it('should return minStart when newStart is too small', function () {
            var newStart = 5;
            var currentZoom = { axisId: 'x-axis', start: 10, end: 100 };
            var options = { minStart: 20, minSpan: 10, maxSpan: 100 };
            var result = (0, zoom_utils_1.calculateZoomStart)(newStart, currentZoom, options);
            expect(result).to.eq(20);
        });
        it('should adjust based on minSpan if newStart is outside valid range', function () {
            var newStart = 95;
            var currentZoom = { axisId: 'x-axis', start: 10, end: 100 };
            var options = { minStart: 20, minSpan: 10, maxSpan: 80 };
            var result = (0, zoom_utils_1.calculateZoomStart)(newStart, currentZoom, options);
            expect(result).to.eq(90);
        });
        it('should adjust based on maxSpan if newStart is too small', function () {
            var newStart = 40;
            var currentZoom = { axisId: 'x-axis', start: 10, end: 100 };
            var options = { minStart: 20, minSpan: 10, maxSpan: 50 };
            var result = (0, zoom_utils_1.calculateZoomStart)(newStart, currentZoom, options);
            expect(result).to.eq(50);
        });
        it('should return newStart if it is within the valid range', function () {
            var newStart = 70;
            var currentZoom = { axisId: 'x-axis', start: 10, end: 100 };
            var options = { minStart: 20, minSpan: 10, maxSpan: 90 };
            var result = (0, zoom_utils_1.calculateZoomStart)(newStart, currentZoom, options);
            expect(result).to.eq(70);
        });
    });
    describe('calculateZoomEnd', function () {
        it('should return newEnd if it satisfies the constraints', function () {
            var currentZoom = { axisId: 'x', start: 10, end: 30 };
            var options = { maxEnd: 100, minSpan: 5, maxSpan: 50 };
            var result = (0, zoom_utils_1.calculateZoomEnd)(25, currentZoom, options);
            expect(result).to.eq(25);
        });
        it('should return maxEnd if newEnd exceeds maxEnd', function () {
            var currentZoom = { axisId: 'x', start: 10, end: 30 };
            var options = { maxEnd: 50, minSpan: 5, maxSpan: 50 };
            var result = (0, zoom_utils_1.calculateZoomEnd)(60, currentZoom, options);
            expect(result).to.eq(50);
        });
        it('should return start + maxSpan if newEnd exceeds start + maxSpan', function () {
            var currentZoom = { axisId: 'x', start: 10, end: 30 };
            var options = { maxEnd: 100, minSpan: 5, maxSpan: 20 };
            var result = (0, zoom_utils_1.calculateZoomEnd)(35, currentZoom, options);
            expect(result).to.eq(30);
        });
        it('should return start + minSpan if newEnd is less than start + minSpan', function () {
            var currentZoom = { axisId: 'x', start: 10, end: 30 };
            var options = { maxEnd: 100, minSpan: 5, maxSpan: 50 };
            var result = (0, zoom_utils_1.calculateZoomEnd)(12, currentZoom, options);
            expect(result).to.eq(15);
        });
    });
    describe('calculateZoomFromPointImpl', function () {
        var defaultDrawingArea = {
            left: 100,
            top: 100,
            right: 300,
            bottom: 200,
            width: 200,
            height: 100,
        };
        it('should calculate correct zoom value for x-axis (bottom position)', function () {
            var result = (0, zoom_utils_1.calculateZoomFromPointImpl)(defaultDrawingArea, { position: 'bottom', reverse: false }, { minStart: 0, maxEnd: 100 }, { x: 200, y: 0 });
            expect(result).to.eq(50);
        });
        it('should calculate correct zoom value for y-axis (left position)', function () {
            var result = (0, zoom_utils_1.calculateZoomFromPointImpl)(defaultDrawingArea, { position: 'left', reverse: false }, { minStart: 0, maxEnd: 100 }, { x: 0, y: 100 });
            expect(result).to.eq(100);
        });
        it('should handle reversed x-axis', function () {
            var result = (0, zoom_utils_1.calculateZoomFromPointImpl)(defaultDrawingArea, { position: 'bottom', reverse: true }, { minStart: 0, maxEnd: 100 }, { x: 300, y: 0 });
            expect(result).to.eq(0); // Should be at the start due to reverse
        });
        it('should handle reversed y-axis', function () {
            var result = (0, zoom_utils_1.calculateZoomFromPointImpl)(defaultDrawingArea, { position: 'left', reverse: true }, { minStart: 0, maxEnd: 100 }, { x: 0, y: 180 });
            expect(result).to.eq(80);
        });
        it('should handle custom min/max range', function () {
            var result = (0, zoom_utils_1.calculateZoomFromPointImpl)(defaultDrawingArea, { position: 'bottom', reverse: false }, { minStart: 20, maxEnd: 80 }, { x: 150, y: 0 });
            expect(result).to.eq(35);
        });
    });
});
