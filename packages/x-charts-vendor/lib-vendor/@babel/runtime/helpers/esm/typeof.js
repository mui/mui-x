"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _typeof;
function _typeof(o) {
  "@babel/helpers - typeof";

  return exports.default = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}