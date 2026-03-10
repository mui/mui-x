"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCommonKeyboardFocusHandler_1 = require("../../internals/createCommonKeyboardFocusHandler");
var composition_1 = require("../../models/seriesType/composition");
var keyboardFocusHandler = (0, createCommonKeyboardFocusHandler_1.createCommonKeyboardFocusHandler)(composition_1.composableCartesianSeriesTypes);
exports.default = keyboardFocusHandler;
