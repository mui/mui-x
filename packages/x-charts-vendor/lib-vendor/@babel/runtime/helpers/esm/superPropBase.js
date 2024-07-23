"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _superPropBase;
var _getPrototypeOf = _interopRequireDefault(require("./getPrototypeOf.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = (0, _getPrototypeOf.default)(t)););
  return t;
}