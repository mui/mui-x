"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANIMATION_TIMING_FUNCTION_JS = exports.ANIMATION_TIMING_FUNCTION = exports.ANIMATION_DURATION_MS = void 0;
var bezier_easing_1 = require("bezier-easing");
exports.ANIMATION_DURATION_MS = 300;
exports.ANIMATION_TIMING_FUNCTION = 'cubic-bezier(0.66, 0, 0.34, 1)';
exports.ANIMATION_TIMING_FUNCTION_JS = (0, bezier_easing_1.default)(0.66, 0, 0.34, 1);
