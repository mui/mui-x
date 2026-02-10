"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCartesianSeriesType = isCartesianSeriesType;
exports.isCartesianSeries = isCartesianSeries;
var configInit_1 = require("./configInit");
function isCartesianSeriesType(seriesType) {
    return configInit_1.cartesianSeriesTypes.getTypes().has(seriesType);
}
function isCartesianSeries(series) {
    return isCartesianSeriesType(series.type);
}
