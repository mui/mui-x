"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSeriesConfig = exports.selectorChartSeriesConfigState = void 0;
var store_1 = require("@mui/x-internals/store");
var selectorChartSeriesConfigState = function (state) { return state.seriesConfig; };
exports.selectorChartSeriesConfigState = selectorChartSeriesConfigState;
exports.selectorChartSeriesConfig = (0, store_1.createSelector)(exports.selectorChartSeriesConfigState, function (seriesConfigState) { return seriesConfigState.config; });
