"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deviation;
var _variance = _interopRequireDefault(require("./variance.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function deviation(values, valueof) {
  const v = (0, _variance.default)(values, valueof);
  return v ? Math.sqrt(v) : v;
}