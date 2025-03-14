"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function selection_cloneShallow() {
  var clone = this.cloneNode(false),
    parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true),
    parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function _default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}