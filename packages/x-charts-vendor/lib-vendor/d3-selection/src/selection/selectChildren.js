"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _matcher = require("../matcher.js");
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function () {
    return filter.call(this.children, match);
  };
}
function _default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : (0, _matcher.childMatcher)(match)));
}