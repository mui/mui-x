"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barSeriesConfig = void 0;
var extremums_1 = require("./bar/extremums");
var seriesProcessor_1 = require("./bar/seriesProcessor");
var legend_1 = require("./bar/legend");
var getColor_1 = require("./bar/getColor");
var keyboardFocusHandler_1 = require("./bar/keyboardFocusHandler");
var tooltip_1 = require("./bar/tooltip");
var tooltipPosition_1 = require("./bar/tooltipPosition");
var getSeriesWithDefaultValues_1 = require("./bar/getSeriesWithDefaultValues");
var identifierSerializer_1 = require("../../internals/identifierSerializer");
var identifierCleaner_1 = require("../../internals/identifierCleaner");
exports.barSeriesConfig = {
    seriesProcessor: seriesProcessor_1.default,
    colorProcessor: getColor_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    axisTooltipGetter: tooltip_1.axisTooltipGetter,
    xExtremumGetter: extremums_1.getExtremumX,
    yExtremumGetter: extremums_1.getExtremumY,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.getSeriesWithDefaultValues,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: identifierSerializer_1.identifierSerializerSeriesIdDataIndex,
    identifierCleaner: identifierCleaner_1.identifierCleanerSeriesIdDataIndex,
};
