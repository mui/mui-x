"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _schedule = require("./schedule.js");
function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    (0, _schedule.set)(this, id).ease = value;
  };
}
function _default(value) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value)) : (0, _schedule.get)(this.node(), id).ease;
}