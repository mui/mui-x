"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withPath = withPath;
var _index = require("../../../lib-vendor/d3-path/src/index.js");
function withPath(shape) {
  let digits = 3;
  shape.digits = function (_) {
    if (!arguments.length) return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };
  return () => new _index.Path(digits);
}