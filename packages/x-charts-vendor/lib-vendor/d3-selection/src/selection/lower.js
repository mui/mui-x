"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function _default() {
  return this.each(lower);
}