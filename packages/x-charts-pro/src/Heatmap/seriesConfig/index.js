"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heatmapSeriesConfig = void 0;
var internals_1 = require("@mui/x-charts/internals");
var extremums_1 = require("./extremums");
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var tooltip_1 = require("./tooltip");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
var tooltipPosition_1 = require("./tooltipPosition");
var getItemAtPosition_1 = require("./getItemAtPosition");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
var highlight_1 = require("./highlight");
var identifierSerializer_1 = require("./identifierSerializer");
var identifierCleaner_1 = require("./identifierCleaner");
internals_1.cartesianSeriesTypes.addType('heatmap');
exports.heatmapSeriesConfig = {
    seriesProcessor: seriesProcessor_1.default,
    colorProcessor: getColor_1.default,
    legendGetter: function () { return []; },
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    xExtremumGetter: extremums_1.getBaseExtremum,
    yExtremumGetter: extremums_1.getBaseExtremum,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
    identifierSerializer: identifierSerializer_1.default,
    identifierCleaner: identifierCleaner_1.default,
    getItemAtPosition: getItemAtPosition_1.default,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    isHighlightedCreator: highlight_1.createIsHighlighted,
    isFadedCreator: highlight_1.createIsFaded,
};
