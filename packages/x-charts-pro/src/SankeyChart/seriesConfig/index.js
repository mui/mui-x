"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sankeySeriesConfig = void 0;
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
var tooltipGetter_1 = require("./tooltipGetter");
var calculateSankeyLayout_1 = require("../calculateSankeyLayout");
var tooltipPosition_1 = require("./tooltipPosition");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
var identifierSerializer_1 = require("./identifierSerializer");
var identifierCleaner_1 = require("./identifierCleaner");
var createIsHighlighted_1 = require("./createIsHighlighted");
var createIsFaded_1 = require("./createIsFaded");
// Simple passthrough functions for sankey chart
var seriesProcessor = function (series) { return series; };
var colorProcessor = function (series) { return series; };
var legendGetter = function () { return []; };
var seriesLayout = function (series, drawingArea) {
    var _a;
    if (series.seriesOrder.length === 0) {
        return {};
    }
    return _a = {},
        _a[series.seriesOrder[0]] = {
            sankeyLayout: (0, calculateSankeyLayout_1.calculateSankeyLayout)(series.series[series.seriesOrder[0]], drawingArea),
        },
        _a;
};
exports.sankeySeriesConfig = {
    seriesProcessor: seriesProcessor,
    seriesLayout: seriesLayout,
    colorProcessor: colorProcessor,
    legendGetter: legendGetter,
    tooltipGetter: tooltipGetter_1.tooltipGetter,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.getSeriesWithDefaultValues,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: identifierSerializer_1.default,
    identifierCleaner: identifierCleaner_1.default,
    isHighlightedCreator: createIsHighlighted_1.createSankeyIsHighlighted,
    isFadedCreator: createIsFaded_1.createSankeyIsFaded,
};
