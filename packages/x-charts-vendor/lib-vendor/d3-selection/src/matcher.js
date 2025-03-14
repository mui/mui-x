"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.childMatcher = childMatcher;
exports.default = _default;
function _default(selector) {
  return function () {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function (node) {
    return node.matches(selector);
  };
}