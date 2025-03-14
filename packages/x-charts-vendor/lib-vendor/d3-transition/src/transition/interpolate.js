"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("../../../../lib-vendor/d3-color/src/index.js");
var _index2 = require("../../../../lib-vendor/d3-interpolate/src/index.js");
function _default(a, b) {
  var c;
  return (typeof b === "number" ? _index2.interpolateNumber : b instanceof _index.color ? _index2.interpolateRgb : (c = (0, _index.color)(b)) ? (b = c, _index2.interpolateRgb) : _index2.interpolateString)(a, b);
}