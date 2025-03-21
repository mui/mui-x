"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function none() {}
function _default(selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}