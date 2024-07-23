"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _instanceof;
function _instanceof(n, e) {
  return null != e && "undefined" != typeof Symbol && e[Symbol.hasInstance] ? !!e[Symbol.hasInstance](n) : n instanceof e;
}