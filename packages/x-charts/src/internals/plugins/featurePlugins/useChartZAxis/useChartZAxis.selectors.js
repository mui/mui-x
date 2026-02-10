"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartZAxis = void 0;
var store_1 = require("@mui/x-internals/store");
var selectRootState = function (state) { return state; };
exports.selectorChartZAxis = (0, store_1.createSelector)(selectRootState, function (state) { return state.zAxis; });
