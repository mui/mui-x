"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RANGE_VIEW_HEIGHT = exports.DAY_RANGE_SIZE = exports.DAY_MARGIN = void 0;
var internals_1 = require("@mui/x-date-pickers/internals");
var internals_2 = require("@mui/x-date-pickers/internals");
Object.defineProperty(exports, "DAY_MARGIN", { enumerable: true, get: function () { return internals_2.DAY_MARGIN; } });
exports.DAY_RANGE_SIZE = 40;
// adding the extra height of the range day element height difference (40px vs 36px)
exports.RANGE_VIEW_HEIGHT = internals_1.VIEW_HEIGHT + 6 * 2 * internals_1.DAY_MARGIN;
