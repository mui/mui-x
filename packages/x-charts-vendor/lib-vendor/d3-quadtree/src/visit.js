"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _quad = _interopRequireDefault(require("./quad.js"));
function _default(callback) {
  var quads = [],
    q,
    node = this._root,
    child,
    x0,
    y0,
    x1,
    y1;
  if (node) quads.push(new _quad.default(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2,
        ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new _quad.default(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new _quad.default(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new _quad.default(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new _quad.default(child, x0, y0, xm, ym));
    }
  }
  return this;
}