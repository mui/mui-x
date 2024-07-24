"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thresholdFreedmanDiaconis;
var _count = _interopRequireDefault(require("../count.js"));
var _quantile = _interopRequireDefault(require("../quantile.js"));
function thresholdFreedmanDiaconis(values, min, max) {
  const c = (0, _count.default)(values),
    d = (0, _quantile.default)(values, 0.75) - (0, _quantile.default)(values, 0.25);
  return c && d ? Math.ceil((max - min) / (2 * d * Math.pow(c, -1 / 3))) : 1;
}