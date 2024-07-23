"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _objectSpread;
var _defineProperty = _interopRequireDefault(require("./defineProperty.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? Object(arguments[r]) : {},
      o = Object.keys(t);
    "function" == typeof Object.getOwnPropertySymbols && o.push.apply(o, Object.getOwnPropertySymbols(t).filter(function (e) {
      return Object.getOwnPropertyDescriptor(t, e).enumerable;
    })), o.forEach(function (r) {
      (0, _defineProperty.default)(e, r, t[r]);
    });
  }
  return e;
}