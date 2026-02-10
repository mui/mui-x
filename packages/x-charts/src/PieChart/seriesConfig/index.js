"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pieSeriesConfig = void 0;
var seriesProcessor_1 = require("./seriesProcessor");
var getColor_1 = require("./getColor");
var legend_1 = require("./legend");
var tooltip_1 = require("./tooltip");
var seriesLayout_1 = require("./seriesLayout");
var getSeriesWithDefaultValues_1 = require("./getSeriesWithDefaultValues");
var tooltipPosition_1 = require("./tooltipPosition");
var keyboardFocusHandler_1 = require("./keyboardFocusHandler");
var identifierSerializer_1 = require("../../internals/identifierSerializer");
var identifierCleaner_1 = require("../../internals/identifierCleaner");
exports.pieSeriesConfig = {
    colorProcessor: getColor_1.default,
    seriesProcessor: seriesProcessor_1.default,
    seriesLayout: seriesLayout_1.default,
    legendGetter: legend_1.default,
    tooltipGetter: tooltip_1.default,
    tooltipItemPositionGetter: tooltipPosition_1.default,
    getSeriesWithDefaultValues: getSeriesWithDefaultValues_1.default,
    keyboardFocusHandler: keyboardFocusHandler_1.default,
    identifierSerializer: identifierSerializer_1.identifierSerializerSeriesIdDataIndex,
    identifierCleaner: identifierCleaner_1.identifierCleanerSeriesIdDataIndex,
};
