"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.sum = sum;
var _none = _interopRequireDefault(require("./none.js"));
function _default(series) {
  var sums = series.map(sum);
  return (0, _none.default)(series).sort(function (a, b) {
    return sums[a] - sums[b];
  });
}
function sum(series) {
  var s = 0,
    i = -1,
    n = series.length,
    v;
  while (++i < n) if (v = +series[i][1]) s += v;
  return s;
}