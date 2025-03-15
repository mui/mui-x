"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _matcher = require("../matcher.js");
var find = Array.prototype.find;
function childFind(match) {
  return function () {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function _default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : (0, _matcher.childMatcher)(match)));
}