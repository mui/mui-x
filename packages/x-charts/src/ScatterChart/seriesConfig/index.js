"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scatterSeriesConfig = void 0;
var extremums_1 = require("./extremums");
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var legend_1 = require("./legend");
var tooltip_1 = require("./tooltip");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
var tooltipPosition_1 = require("./tooltipPosition");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
var identifierSerializer_1 = require("../../internals/identifierSerializer");
var identifierCleaner_1 = require("../../internals/identifierCleaner");
exports.scatterSeriesConfig = {
    seriesProcessor: seriesProcessor_1.default,
    colorProcessor: getColor_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    xExtremumGetter: extremums_1.getExtremumX,
    yExtremumGetter: extremums_1.getExtremumY,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: identifierSerializer_1.identifierSerializerSeriesIdDataIndex,
    identifierCleaner: identifierCleaner_1.identifierCleanerSeriesIdDataIndex,
};
