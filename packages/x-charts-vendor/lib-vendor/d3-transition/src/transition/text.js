"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _tween = require("./tween.js");
function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function _default(value) {
  return this.tween("text", typeof value === "function" ? textFunction((0, _tween.tweenValue)(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}