"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.link = link;
exports.linkHorizontal = linkHorizontal;
exports.linkRadial = linkRadial;
exports.linkVertical = linkVertical;
var _array = require("./array.js");
var _constant = _interopRequireDefault(require("./constant.js"));
var _bump = require("./curve/bump.js");
var _path = require("./path.js");
var _point = require("./point.js");
function linkSource(d) {
  return d.source;
}
function linkTarget(d) {
  return d.target;
}
function link(curve) {
  let source = linkSource,
    target = linkTarget,
    x = _point.x,
    y = _point.y,
    context = null,
    output = null,
    path = (0, _path.withPath)(link);
  function link() {
    let buffer;
    const argv = _array.slice.call(arguments);
    const s = source.apply(this, argv);
    const t = target.apply(this, argv);
    if (context == null) output = curve(buffer = path());
    output.lineStart();
    argv[0] = s, output.point(+x.apply(this, argv), +y.apply(this, argv));
    argv[0] = t, output.point(+x.apply(this, argv), +y.apply(this, argv));
    output.lineEnd();
    if (buffer) return output = null, buffer + "" || null;
  }
  link.source = function (_) {
    return arguments.length ? (source = _, link) : source;
  };
  link.target = function (_) {
    return arguments.length ? (target = _, link) : target;
  };
  link.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), link) : x;
  };
  link.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), link) : y;
  };
  link.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), link) : context;
  };
  return link;
}
function linkHorizontal() {
  return link(_bump.bumpX);
}
function linkVertical() {
  return link(_bump.bumpY);
}
function linkRadial() {
  const l = link(_bump.bumpRadial);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}