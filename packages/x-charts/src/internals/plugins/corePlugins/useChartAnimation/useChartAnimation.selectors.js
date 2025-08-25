"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSkipAnimation = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorChartAnimationState = function (state) {
    return state.animation;
};
exports.selectorChartSkipAnimation = (0, selectors_1.createSelector)([selectorChartAnimationState], function (state) { return state.skip || state.skipAnimationRequests > 0; });
