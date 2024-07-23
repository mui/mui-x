"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thresholdScott;
var _count = _interopRequireDefault(require("../count.js"));
var _deviation = _interopRequireDefault(require("../deviation.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function thresholdScott(values, min, max) {
  const c = (0, _count.default)(values),
    d = (0, _deviation.default)(values);
  return c && d ? Math.ceil((max - min) * Math.cbrt(c) / (3.49 * d)) : 1;
}