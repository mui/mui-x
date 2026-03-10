"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var d3_scale_1 = require("@mui/x-charts-vendor/d3-scale");
var Flatbush_1 = require("../../../Flatbush");
var findClosestPoints_1 = require("./findClosestPoints");
var zoom_1 = require("../useChartCartesianAxis/zoom");
function prepareFlatbush(seriesData, xScale, yScale) {
    var flatbush = new Flatbush_1.Flatbush(seriesData.length);
    var normalizedXScale = xScale.copy();
    var normalizedYScale = yScale.copy();
    normalizedXScale.range([0, 1]);
    normalizedYScale.range([0, 1]);
    seriesData.forEach(function (point) { return flatbush.add(normalizedXScale(point.x), normalizedYScale(point.y)); });
    flatbush.finish();
    return flatbush;
}
var noZoom = { start: 0, end: 1 };
var drawingArea = { left: 0, top: 0, width: 1000, height: 1000 };
var infiniteMaxRadius = Infinity;
var returnAllResults = Infinity;
(0, vitest_1.describe)('findClosestPoints', function () {
    it('finds the closest points without zoom and using two linear scales', function () {
        var seriesData = [
            { x: 30, y: 30 },
            { x: 60, y: 60 },
        ];
        var xScale = (0, d3_scale_1.scaleLinear)()
            .domain([0, 100])
            .range([drawingArea.left, drawingArea.left + drawingArea.width]);
        var yScale = (0, d3_scale_1.scaleLinear)()
            .domain([0, 100])
            .range([drawingArea.top, drawingArea.top + drawingArea.height]);
        var flatbush = prepareFlatbush(seriesData, xScale, yScale);
        var svgPoint = { x: 500, y: 500 };
        var closestPoint = (0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, noZoom.start, // x
        noZoom.end, // x
        noZoom.start, // y
        noZoom.end, // y
        svgPoint.x, svgPoint.y, infiniteMaxRadius, returnAllResults);
        expect(closestPoint).to.deep.eq([1, 0]);
    });
    (0, vitest_1.describe)('linear and log scales', function () {
        var svgPoint = { x: 500, y: 500 };
        it('finds the closest point without zoom', function () {
            var seriesData = [
                { x: 40, y: 10 },
                { x: 40, y: 999 },
            ];
            var xScale = (0, d3_scale_1.scaleLinear)()
                .domain([0, 100])
                .range([drawingArea.left, drawingArea.left + drawingArea.width]);
            var yScale = (0, d3_scale_1.scaleLog)()
                .domain([1, 10000])
                .range([drawingArea.top, drawingArea.top + drawingArea.height]);
            var flatbush = prepareFlatbush(seriesData, xScale, yScale);
            var closestPoint = (0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, noZoom.start, // x
            noZoom.end, // x
            noZoom.start, // y
            noZoom.end, // y
            svgPoint.x, svgPoint.y);
            expect(closestPoint).to.deep.eq([1]);
        });
        (0, vitest_1.describe)('with zoom', function () {
            var xZoom = { start: 0.4, end: 0.6 }; // The x scale's "visible domain" should be [40, 60]
            var yZoom = { start: 0.25, end: 0.75 }; // The y scale's "visible domain" should be [10, 1000].
            var xScale = (0, d3_scale_1.scaleLinear)()
                .domain([0, 100])
                .range((0, zoom_1.zoomScaleRange)([drawingArea.left, drawingArea.left + drawingArea.width], [xZoom.start * 100, xZoom.end * 100]));
            var yScale = (0, d3_scale_1.scaleLog)()
                .domain([1, 10000])
                .range((0, zoom_1.zoomScaleRange)([drawingArea.top, drawingArea.top + drawingArea.height], [yZoom.start * 100, yZoom.end * 100]));
            it('finds the closest points', function () {
                var seriesData = [
                    { x: 40, y: 11 },
                    { x: 60, y: 1000 },
                ];
                var flatbush = prepareFlatbush(seriesData, xScale, yScale);
                expect((0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, xZoom.start, xZoom.end, yZoom.start, yZoom.end, svgPoint.x, svgPoint.y)).to.deep.eq([0]);
            });
            it('finds the closest points with max radius', function () {
                var seriesData = [
                    { x: 48, y: 100 },
                    { x: 48.01, y: 100 },
                    { x: 52, y: 100 },
                    { x: 51.99, y: 100 },
                    { x: 50, y: 64 },
                    { x: 50, y: 158 },
                ];
                var maxRadius = 100;
                var flatbush = prepareFlatbush(seriesData, xScale, yScale);
                expect((0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, xZoom.start, xZoom.end, yZoom.start, yZoom.end, 
                // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
                svgPoint.x, svgPoint.y, maxRadius, returnAllResults)).to.deep.eq([4, 5, 1, 3]);
            });
            it("finds no point when it's outside max radius", function () {
                var seriesData = [
                    { x: -5, y: 1000 }, // This point is outside the x scale's domain, so it should not be considered.
                    { x: 100, y: 100000 }, // This point is outside the y scale's domain, so it should not be considered.
                    // These other points are within the domain, but they are outside the max radius.
                    { x: 47, y: 100 },
                    { x: 53, y: 100 },
                    { x: 50, y: 63 },
                    { x: 50, y: 159 },
                ];
                var maxRadius = 100;
                var flatbush = prepareFlatbush(seriesData, xScale, yScale);
                // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
                // This means that a point at (48, 100)
                expect((0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, xZoom.start, xZoom.end, yZoom.start, yZoom.end, 
                // The point (500, 500) in SVG coordinates corresponds to (50, 100) in the data coordinates.
                svgPoint.x, svgPoint.y, maxRadius, returnAllResults)).to.deep.eq([]);
            });
        });
    });
    (0, vitest_1.describe)('reversed axes', function () {
        it('finds the closest point', function () {
            var svgPoint = { x: 400, y: 500 };
            var seriesData = [
                { x: 40, y: 10 },
                { x: 60, y: 999 },
            ];
            var xScale = (0, d3_scale_1.scaleLinear)()
                .domain([0, 100])
                .range([drawingArea.left, drawingArea.left + drawingArea.width].reverse());
            var yScale = (0, d3_scale_1.scaleLog)()
                .domain([1, 10000])
                .range([drawingArea.top, drawingArea.top + drawingArea.height].reverse());
            var flatbush = prepareFlatbush(seriesData, xScale, yScale);
            var closestPoint = (0, findClosestPoints_1.findClosestPoints)(flatbush, seriesData, xScale, yScale, noZoom.start, // x
            noZoom.end, // x
            noZoom.start, // y
            noZoom.end, // y
            svgPoint.x, svgPoint.y);
            expect(closestPoint).to.deep.eq([1]);
        });
    });
});
