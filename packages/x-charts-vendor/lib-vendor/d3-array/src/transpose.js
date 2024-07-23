"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transpose;
var _min = _interopRequireDefault(require("./min.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function transpose(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = (0, _min.default)(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}
function length(d) {
  return d.length;
}