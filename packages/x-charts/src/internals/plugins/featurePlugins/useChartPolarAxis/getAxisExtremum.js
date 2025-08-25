"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxisExtremum = void 0;
var isPolar_1 = require("../../../isPolar");
var axisExtremumCallback = function (acc, chartType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries) {
    var _a, _b, _c;
    var getter = axisDirection === 'rotation'
        ? seriesConfig[chartType].rotationExtremumGetter
        : seriesConfig[chartType].radiusExtremumGetter;
    var series = (_b = (_a = formattedSeries[chartType]) === null || _a === void 0 ? void 0 : _a.series) !== null && _b !== void 0 ? _b : {};
    var _d = (_c = getter === null || getter === void 0 ? void 0 : getter({
        series: series,
        axis: axis,
        axisIndex: axisIndex,
        isDefaultAxis: axisIndex === 0,
    })) !== null && _c !== void 0 ? _c : [Infinity, -Infinity], minChartTypeData = _d[0], maxChartTypeData = _d[1];
    var minData = acc[0], maxData = acc[1];
    return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};
var getAxisExtremum = function (axis, axisDirection, seriesConfig, axisIndex, formattedSeries) {
    var polarSeriesTypes = Object.keys(seriesConfig).filter(isPolar_1.isPolarSeriesType);
    var extremums = polarSeriesTypes.reduce(function (acc, charType) {
        return axisExtremumCallback(acc, charType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries);
    }, [Infinity, -Infinity]);
    if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
        return [Infinity, -Infinity];
    }
    return extremums;
};
exports.getAxisExtremum = getAxisExtremum;
