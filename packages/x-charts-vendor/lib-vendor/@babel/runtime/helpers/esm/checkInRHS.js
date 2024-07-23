"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _checkInRHS;
var _typeof2 = _interopRequireDefault(require("./typeof.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _checkInRHS(e) {
  if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? (0, _typeof2.default)(e) : "null"));
  return e;
}