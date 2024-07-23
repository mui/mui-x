"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _assertClassBrand;
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}