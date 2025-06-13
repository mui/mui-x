"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hclLong = exports.default = void 0;
var _index = require("../../../lib-vendor/d3-color/src/index.js");
var _color = _interopRequireWildcard(require("./color.js"));
function hcl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _index.hcl)(start)).h, (end = (0, _index.hcl)(end)).h),
      c = (0, _color.default)(start.c, end.c),
      l = (0, _color.default)(start.l, end.l),
      opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}
var _default = exports.default = hcl(_color.hue);
var hclLong = exports.hclLong = hcl(_color.default);