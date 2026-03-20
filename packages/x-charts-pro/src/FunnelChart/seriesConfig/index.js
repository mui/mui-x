"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funnelSeriesConfig = void 0;
var internals_1 = require("@mui/x-charts/internals");
var extremums_1 = require("./extremums");
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var legend_1 = require("./legend");
var tooltip_1 = require("./tooltip");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
var tooltipPosition_1 = require("./tooltipPosition");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
exports.funnelSeriesConfig = {
    seriesProcessor: seriesProcessor_1.default,
    colorProcessor: getColor_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    xExtremumGetter: extremums_1.getExtremumX,
    yExtremumGetter: extremums_1.getExtremumY,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: internals_1.identifierSerializerSeriesIdDataIndex,
    identifierCleaner: internals_1.identifierCleanerSeriesIdDataIndex,
    isHighlightedCreator: internals_1.createIsHighlighted,
    isFadedCreator: internals_1.createIsFaded,
};
