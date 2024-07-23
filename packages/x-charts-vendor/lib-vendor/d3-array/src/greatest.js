"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = greatest;
var _ascending = _interopRequireDefault(require("./ascending.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function greatest(values, compare = _ascending.default) {
  let max;
  let defined = false;
  if (compare.length === 1) {
    let maxValue;
    for (const element of values) {
      const value = compare(element);
      if (defined ? (0, _ascending.default)(value, maxValue) > 0 : (0, _ascending.default)(value, value) === 0) {
        max = element;
        maxValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined ? compare(value, max) > 0 : compare(value, value) === 0) {
        max = value;
        defined = true;
      }
    }
  }
  return max;
}