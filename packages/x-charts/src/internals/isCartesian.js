"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCartesianSeriesType = isCartesianSeriesType;
var configInit_1 = require("./configInit");
function isCartesianSeriesType(seriesType) {
    return configInit_1.cartesianSeriesTypes.getTypes().has(seriesType);
}
