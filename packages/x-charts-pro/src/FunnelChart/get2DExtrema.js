"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get2DExtrema = void 0;
var get2DExtrema = function (dataPoints, xPositionGetter, yPositionGetter) {
    var minPoint = {
        x: Infinity,
        y: Infinity,
    };
    var maxPoint = {
        x: -Infinity,
        y: -Infinity,
    };
    dataPoints.forEach(function (section, dataIndex) {
        section.forEach(function (v) {
            var x = xPositionGetter(v.x, dataIndex, v.stackOffset, v.useBandWidth);
            var y = yPositionGetter(v.y, dataIndex, v.stackOffset, v.useBandWidth);
            minPoint.x = Math.min(minPoint.x, x);
            minPoint.y = Math.min(minPoint.y, y);
            maxPoint.x = Math.max(maxPoint.x, x);
            maxPoint.y = Math.max(maxPoint.y, y);
        });
    });
    return [minPoint, maxPoint];
};
exports.get2DExtrema = get2DExtrema;
