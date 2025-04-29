"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _radial = _interopRequireWildcard(require("./curve/radial.js"));
var _area = _interopRequireDefault(require("./area.js"));
var _lineRadial = require("./lineRadial.js");
function _default() {
  var a = (0, _area.default)().curve(_radial.curveRadialLinear),
    c = a.curve,
    x0 = a.lineX0,
    x1 = a.lineX1,
    y0 = a.lineY0,
    y1 = a.lineY1;
  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function () {
    return (0, _lineRadial.lineRadial)(x0());
  }, delete a.lineX0;
  a.lineEndAngle = function () {
    return (0, _lineRadial.lineRadial)(x1());
  }, delete a.lineX1;
  a.lineInnerRadius = function () {
    return (0, _lineRadial.lineRadial)(y0());
  }, delete a.lineY0;
  a.lineOuterRadius = function () {
    return (0, _lineRadial.lineRadial)(y1());
  }, delete a.lineY1;
  a.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };
  return a;
}