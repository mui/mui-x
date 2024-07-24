"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thresholdScott;
var _count = _interopRequireDefault(require("../count.js"));
var _deviation = _interopRequireDefault(require("../deviation.js"));
function thresholdScott(values, min, max) {
  const c = (0, _count.default)(values),
    d = (0, _deviation.default)(values);
  return c && d ? Math.ceil((max - min) * Math.cbrt(c) / (3.49 * d)) : 1;
}