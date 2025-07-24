"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.defaultY = defaultY;
function defaultY(d) {
  return d[1];
}
function _default(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}