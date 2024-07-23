"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _isNativeFunction;
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}