"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _exponent = _interopRequireDefault(require("./exponent.js"));
function _default(step) {
  return Math.max(0, -(0, _exponent.default)(Math.abs(step)));
}