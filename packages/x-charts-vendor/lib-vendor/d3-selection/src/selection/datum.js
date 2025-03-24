"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}