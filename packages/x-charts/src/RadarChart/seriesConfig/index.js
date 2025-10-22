"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radarSeriesConfig = void 0;
var formatter_1 = require("./formatter");
var getColor_1 = require("./getColor");
var extremums_1 = require("./extremums");
var legend_1 = require("./legend");
var tooltip_1 = require("./tooltip");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
exports.radarSeriesConfig = {
    colorProcessor: getColor_1.default,
    seriesProcessor: formatter_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    axisTooltipGetter: tooltip_1.axisTooltipGetter,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
    radiusExtremumGetter: extremums_1.radiusExtremumGetter,
    rotationExtremumGetter: extremums_1.rotationExtremumGetter,
};
