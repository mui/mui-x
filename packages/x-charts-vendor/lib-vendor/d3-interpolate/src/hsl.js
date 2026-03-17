"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslLong = exports.default = void 0;
var _index = require("../../../lib-vendor/d3-color/src/index.js");
var _color = _interopRequireWildcard(require("./color.js"));
function hsl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _index.hsl)(start)).h, (end = (0, _index.hsl)(end)).h),
      s = (0, _color.default)(start.s, end.s),
      l = (0, _color.default)(start.l, end.l),
      opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}
var _default = exports.default = hsl(_color.hue);
var hslLong = exports.hslLong = hsl(_color.default);