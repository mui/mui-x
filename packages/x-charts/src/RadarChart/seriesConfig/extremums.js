"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotationExtremumGetter = exports.radiusExtremumGetter = void 0;
var radiusExtremumGetter = function (_a) {
    var series = _a.series, axisIndex = _a.axisIndex;
    return Object.keys(series)
        .filter(function (seriesId) { return series[seriesId].type === 'radar'; })
        .reduce(function (acc, seriesId) {
        var data = series[seriesId].data;
        return [Math.min(data[axisIndex], acc[0]), Math.max(data[axisIndex], acc[1])];
    }, [Infinity, -Infinity]);
};
exports.radiusExtremumGetter = radiusExtremumGetter;
var rotationExtremumGetter = function (_a) {
    var _b, _c;
    var axis = _a.axis;
    var min = Math.min.apply(Math, ((_b = axis.data) !== null && _b !== void 0 ? _b : []));
    var max = Math.max.apply(Math, ((_c = axis.data) !== null && _c !== void 0 ? _c : []));
    return [min, max];
};
exports.rotationExtremumGetter = rotationExtremumGetter;
