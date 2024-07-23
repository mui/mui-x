"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toPropertyKey;
var _typeof2 = _interopRequireDefault(require("./typeof.js"));
var _toPrimitive = _interopRequireDefault(require("./toPrimitive.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function toPropertyKey(t) {
  var i = (0, _toPrimitive.default)(t, "string");
  return "symbol" == (0, _typeof2.default)(i) ? i : i + "";
}