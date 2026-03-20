"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var outSeriesTypes = new Set(['funnel']);
var keyboardFocusHandler = (0, internals_1.createCommonKeyboardFocusHandler)(outSeriesTypes);
exports.default = keyboardFocusHandler;
