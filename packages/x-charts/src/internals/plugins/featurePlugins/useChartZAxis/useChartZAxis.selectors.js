"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartZAxis = void 0;
var selectors_1 = require("../../utils/selectors");
var selectRootState = function (state) { return state; };
exports.selectorChartZAxis = (0, selectors_1.createSelector)([selectRootState], function (state) { return state.zAxis; });
