"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPolarSeriesType = isPolarSeriesType;
var configInit_1 = require("./configInit");
function isPolarSeriesType(seriesType) {
    return configInit_1.polarSeriesTypes.getTypes().has(seriesType);
}
