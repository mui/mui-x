"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeBarSeriesConfig = void 0;
var internals_1 = require("@mui/x-charts/internals");
var extrema_1 = require("./extrema");
var tooltip_1 = require("./tooltip");
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var legend_1 = require("./legend");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
var tooltipPosition_1 = require("./tooltipPosition");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
exports.rangeBarSeriesConfig = {
    seriesProcessor: seriesProcessor_1.default,
    colorProcessor: getColor_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    axisTooltipGetter: tooltip_1.axisTooltipGetter,
    xExtremumGetter: extrema_1.getExtremumX,
    yExtremumGetter: extrema_1.getExtremumY,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.getSeriesWithDefaultValues,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: internals_1.identifierSerializerSeriesIdDataIndex,
    identifierCleaner: internals_1.identifierCleanerSeriesIdDataIndex,
    isHighlightedCreator: internals_1.createIsHighlighted,
    isFadedCreator: internals_1.createIsFaded,
};
internals_1.cartesianSeriesTypes.addType('rangeBar');
