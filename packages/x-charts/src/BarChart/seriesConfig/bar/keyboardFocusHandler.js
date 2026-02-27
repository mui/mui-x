"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createCommonKeyboardFocusHandler_1 = require("../../../internals/createCommonKeyboardFocusHandler");
var commonNextFocusItem_1 = require("../../../internals/commonNextFocusItem");
var keyboardFocusHandler = (0, createCommonKeyboardFocusHandler_1.createCommonKeyboardFocusHandler)(commonNextFocusItem_1.composableCartesianSeriesTypes);
exports.default = keyboardFocusHandler;
