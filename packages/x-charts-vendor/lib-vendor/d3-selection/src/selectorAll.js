"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function empty() {
  return [];
}
function _default(selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}