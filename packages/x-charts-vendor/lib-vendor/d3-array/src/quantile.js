"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantile;
exports.quantileIndex = quantileIndex;
exports.quantileSorted = quantileSorted;
var _max = _interopRequireDefault(require("./max.js"));
var _maxIndex = _interopRequireDefault(require("./maxIndex.js"));
var _min = _interopRequireDefault(require("./min.js"));
var _minIndex = _interopRequireDefault(require("./minIndex.js"));
var _quickselect = _interopRequireDefault(require("./quickselect.js"));
var _number = _interopRequireWildcard(require("./number.js"));
var _sort = require("./sort.js");
var _greatest = _interopRequireDefault(require("./greatest.js"));
function quantile(values, p, valueof) {
  values = Float64Array.from((0, _number.numbers)(values, valueof));
  if (!(n = values.length) || isNaN(p = +p)) return;
  if (p <= 0 || n < 2) return (0, _min.default)(values);
  if (p >= 1) return (0, _max.default)(values);
  var n,
    i = (n - 1) * p,
    i0 = Math.floor(i),
    value0 = (0, _max.default)((0, _quickselect.default)(values, i0).subarray(0, i0 + 1)),
    value1 = (0, _min.default)(values.subarray(i0 + 1));
  return value0 + (value1 - value0) * (i - i0);
}
function quantileSorted(values, p, valueof = _number.default) {
  if (!(n = values.length) || isNaN(p = +p)) return;
  if (p <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
    i = (n - 1) * p,
    i0 = Math.floor(i),
    value0 = +valueof(values[i0], i0, values),
    value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}
function quantileIndex(values, p, valueof = _number.default) {
  if (isNaN(p = +p)) return;
  numbers = Float64Array.from(values, (_, i) => (0, _number.default)(valueof(values[i], i, values)));
  if (p <= 0) return (0, _minIndex.default)(numbers);
  if (p >= 1) return (0, _maxIndex.default)(numbers);
  var numbers,
    index = Uint32Array.from(values, (_, i) => i),
    j = numbers.length - 1,
    i = Math.floor(j * p);
  (0, _quickselect.default)(index, i, 0, j, (i, j) => (0, _sort.ascendingDefined)(numbers[i], numbers[j]));
  i = (0, _greatest.default)(index.subarray(0, i + 1), i => numbers[i]);
  return i >= 0 ? i : -1;
}