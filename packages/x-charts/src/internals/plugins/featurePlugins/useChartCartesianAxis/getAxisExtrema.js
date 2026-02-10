"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisExtrema = getAxisExtrema;
var isCartesian_1 = require("../../../isCartesian");
var axisExtremumCallback = function (chartType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries, getFilters) {
    var _a, _b, _c;
    var getter = axisDirection === 'x'
        ? seriesConfig[chartType].xExtremumGetter
        : seriesConfig[chartType].yExtremumGetter;
    var series = (_b = (_a = formattedSeries[chartType]) === null || _a === void 0 ? void 0 : _a.series) !== null && _b !== void 0 ? _b : {};
    return ((_c = getter === null || getter === void 0 ? void 0 : getter({
        series: series,
        axis: axis,
        axisIndex: axisIndex,
        isDefaultAxis: axisIndex === 0,
        getFilters: getFilters,
    })) !== null && _c !== void 0 ? _c : [Infinity, -Infinity]);
};
function getAxisExtrema(axis, axisDirection, seriesConfig, axisIndex, formattedSeries, getFilters) {
    var cartesianChartTypes = Object.keys(seriesConfig).filter(isCartesian_1.isCartesianSeriesType);
    var extrema = [Infinity, -Infinity];
    for (var _i = 0, cartesianChartTypes_1 = cartesianChartTypes; _i < cartesianChartTypes_1.length; _i++) {
        var chartType = cartesianChartTypes_1[_i];
        var _a = axisExtremumCallback(chartType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries, getFilters), min = _a[0], max = _a[1];
        extrema = [Math.min(extrema[0], min), Math.max(extrema[1], max)];
    }
    if (Number.isNaN(extrema[0]) || Number.isNaN(extrema[1])) {
        return [Infinity, -Infinity];
    }
    return extrema;
}
