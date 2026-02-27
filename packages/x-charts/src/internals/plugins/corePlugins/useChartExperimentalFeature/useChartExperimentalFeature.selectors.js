"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorPreferStrictDomainInLineCharts = exports.selectorChartExperimentalFeaturesState = void 0;
var store_1 = require("@mui/x-internals/store");
var selectorChartExperimentalFeaturesState = function (state) { return state.experimentalFeatures; };
exports.selectorChartExperimentalFeaturesState = selectorChartExperimentalFeaturesState;
exports.selectorPreferStrictDomainInLineCharts = (0, store_1.createSelector)(exports.selectorChartExperimentalFeaturesState, function (features) { return Boolean(features === null || features === void 0 ? void 0 : features.preferStrictDomainInLineCharts); });
