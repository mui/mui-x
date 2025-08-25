"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSeriesConfig = exports.selectorChartSeriesProcessed = exports.selectorChartSeriesState = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorChartSeriesState = function (state) {
    return state.series;
};
exports.selectorChartSeriesState = selectorChartSeriesState;
exports.selectorChartSeriesProcessed = (0, selectors_1.createSelector)([exports.selectorChartSeriesState], function (seriesState) { return seriesState.processedSeries; });
exports.selectorChartSeriesConfig = (0, selectors_1.createSelector)([exports.selectorChartSeriesState], function (seriesState) { return seriesState.seriesConfig; });
