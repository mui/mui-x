"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _exponent = _interopRequireDefault(require("./exponent.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(step) {
  return Math.max(0, -(0, _exponent.default)(Math.abs(step)));
}