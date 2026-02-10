"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSkipAnimation = void 0;
var store_1 = require("@mui/x-internals/store");
var selectorChartAnimationState = function (state) {
    return state.animation;
};
exports.selectorChartSkipAnimation = (0, store_1.createSelector)(selectorChartAnimationState, function (state) { return state.skip || state.skipAnimationRequests > 0; });
