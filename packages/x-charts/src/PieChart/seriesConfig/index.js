"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesConfig = void 0;
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var legend_1 = require("./legend");
var tooltip_1 = require("./tooltip");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
exports.seriesConfig = {
    colorProcessor: getColor_1.default,
    seriesProcessor: seriesProcessor_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
};
