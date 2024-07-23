"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _none = _interopRequireDefault(require("./none.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(series) {
  var peaks = series.map(peak);
  return (0, _none.default)(series).sort(function (a, b) {
    return peaks[a] - peaks[b];
  });
}
function peak(series) {
  var i = -1,
    j = 0,
    n = series.length,
    vi,
    vj = -Infinity;
  while (++i < n) if ((vi = +series[i][1]) > vj) vj = vi, j = i;
  return j;
}