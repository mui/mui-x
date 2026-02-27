"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCommonKeyboardFocusHandler_1 = require("../../internals/createCommonKeyboardFocusHandler");
var outSeriesTypes = new Set(['pie']);
var keyboardFocusHandler = (0, createCommonKeyboardFocusHandler_1.createCommonKeyboardFocusHandler)(outSeriesTypes);
exports.default = keyboardFocusHandler;
