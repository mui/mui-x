"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartRawYAxis = exports.selectorChartRawXAxis = exports.selectorChartCartesianAxisState = void 0;
var selectorChartCartesianAxisState = function (state) { return state.cartesianAxis; };
exports.selectorChartCartesianAxisState = selectorChartCartesianAxisState;
var selectorChartRawXAxis = function (state) { var _a; return (_a = state.cartesianAxis) === null || _a === void 0 ? void 0 : _a.x; };
exports.selectorChartRawXAxis = selectorChartRawXAxis;
var selectorChartRawYAxis = function (state) { var _a; return (_a = state.cartesianAxis) === null || _a === void 0 ? void 0 : _a.y; };
exports.selectorChartRawYAxis = selectorChartRawYAxis;
