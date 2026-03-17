"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.lineRadial = lineRadial;
var _radial = _interopRequireWildcard(require("./curve/radial.js"));
var _line = _interopRequireDefault(require("./line.js"));
function lineRadial(l) {
  var c = l.curve;
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  l.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };
  return l;
}
function _default() {
  return lineRadial((0, _line.default)().curve(_radial.curveRadialLinear));
}