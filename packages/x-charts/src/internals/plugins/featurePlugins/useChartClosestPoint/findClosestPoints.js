"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClosestPoints = findClosestPoints;
var scaleGuards_1 = require("../../../scaleGuards");
function findClosestPoints(flatbush, seriesData, xScale, yScale, xZoomStart, xZoomEnd, yZoomStart, yZoomEnd, svgPointX, svgPointY, maxRadius, maxResults) {
    if (maxRadius === void 0) { maxRadius = Infinity; }
    if (maxResults === void 0) { maxResults = 1; }
    var originalXScale = xScale.copy();
    var originalYScale = yScale.copy();
    originalXScale.range([0, 1]);
    originalYScale.range([0, 1]);
    var excludeIfOutsideDrawingArea = function excludeIfOutsideDrawingArea(index) {
        var x = originalXScale(seriesData[index].x);
        var y = originalYScale(seriesData[index].y);
        return x >= xZoomStart && x <= xZoomEnd && y >= yZoomStart && y <= yZoomEnd;
    };
    // We need to convert the distance from the original range [0, 1] to the current drawing area
    // so the comparison is done on pixels instead of normalized values.
    // fx and fy are the factors to convert the distance from [0, 1] to the current drawing area.
    var fx = xScale.range()[1] - xScale.range()[0];
    var fy = yScale.range()[1] - yScale.range()[0];
    var fxSq = fx * fx;
    var fySq = fy * fy;
    function sqDistFn(dx, dy) {
        return fxSq * dx * dx + fySq * dy * dy;
    }
    var pointX = originalXScale(invertScale(xScale, svgPointX, function (dataIndex) { var _a; return (_a = seriesData[dataIndex]) === null || _a === void 0 ? void 0 : _a.x; }));
    var pointY = originalYScale(invertScale(yScale, svgPointY, function (dataIndex) { var _a; return (_a = seriesData[dataIndex]) === null || _a === void 0 ? void 0 : _a.y; }));
    return flatbush.neighbors(pointX, pointY, maxResults, maxRadius != null ? maxRadius * maxRadius : Infinity, excludeIfOutsideDrawingArea, sqDistFn);
}
function invertScale(scale, value, getDataPoint) {
    if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
        var dataIndex = scale.bandwidth() === 0
            ? Math.floor((value - Math.min.apply(Math, scale.range()) + scale.step() / 2) / scale.step())
            : Math.floor((value - Math.min.apply(Math, scale.range())) / scale.step());
        return getDataPoint(dataIndex);
    }
    return scale.invert(value);
}
