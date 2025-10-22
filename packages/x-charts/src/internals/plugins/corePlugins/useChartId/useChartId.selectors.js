"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartId = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorChartIdState = function (state) { return state.id; };
/**
 * Get the id attribute of the chart.
 * @param {ChartState<[UseChartIdSignature]>} state The state of the chart.
 * @returns {string} The id attribute of the chart.
 */
exports.selectorChartId = (0, selectors_1.createSelector)([selectorChartIdState], function (idState) { return idState.chartId; });
