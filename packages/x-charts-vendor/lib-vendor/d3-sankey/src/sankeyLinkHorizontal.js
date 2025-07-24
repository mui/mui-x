"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("../../../lib-vendor/d3-shape/src/index.js");
function horizontalSource(d) {
  return [d.source.x1, d.y0];
}
function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}
function _default() {
  return (0, _index.linkHorizontal)().source(horizontalSource).target(horizontalTarget);
}