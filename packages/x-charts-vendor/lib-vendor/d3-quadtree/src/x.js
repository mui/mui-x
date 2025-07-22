"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.defaultX = defaultX;
function defaultX(d) {
  return d[0];
}
function _default(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}