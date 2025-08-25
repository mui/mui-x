"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorPreferStrictDomainInLineCharts = exports.selectorChartExperimentalFeaturesState = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorChartExperimentalFeaturesState = function (state) { return state.experimentalFeatures; };
exports.selectorChartExperimentalFeaturesState = selectorChartExperimentalFeaturesState;
exports.selectorPreferStrictDomainInLineCharts = (0, selectors_1.createSelector)([exports.selectorChartExperimentalFeaturesState], function (features) { return Boolean(features === null || features === void 0 ? void 0 : features.preferStrictDomainInLineCharts); });
