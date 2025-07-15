"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thresholdSturges;
var _count = _interopRequireDefault(require("../count.js"));
function thresholdSturges(values) {
  return Math.max(1, Math.ceil(Math.log((0, _count.default)(values)) / Math.LN2) + 1);
}