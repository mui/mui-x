"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _array = _interopRequireDefault(require("./array.js"));
var _constant = _interopRequireDefault(require("./constant.js"));
var _linear = _interopRequireDefault(require("./curve/linear.js"));
var _path = require("./path.js");
var _point = require("./point.js");
function _default(x, y) {
  var defined = (0, _constant.default)(true),
    context = null,
    curve = _linear.default,
    output = null,
    path = (0, _path.withPath)(line);
  x = typeof x === "function" ? x : x === undefined ? _point.x : (0, _constant.default)(x);
  y = typeof y === "function" ? y : y === undefined ? _point.y : (0, _constant.default)(y);
  function line(data) {
    var i,
      n = (data = (0, _array.default)(data)).length,
      d,
      defined0 = false,
      buffer;
    if (context == null) output = curve(buffer = path());
    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }
      if (defined0) output.point(+x(d, i, data), +y(d, i, data));
    }
    if (buffer) return output = null, buffer + "" || null;
  }
  line.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : x;
  };
  line.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : y;
  };
  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : (0, _constant.default)(!!_), line) : defined;
  };
  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };
  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };
  return line;
}