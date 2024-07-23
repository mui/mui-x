"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thresholdSturges;
var _count = _interopRequireDefault(require("../count.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function thresholdSturges(values) {
  return Math.max(1, Math.ceil(Math.log((0, _count.default)(values)) / Math.LN2) + 1);
}