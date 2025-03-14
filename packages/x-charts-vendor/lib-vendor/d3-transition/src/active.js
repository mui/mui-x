"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("./transition/index.js");
var _schedule = require("./transition/schedule.js");
var root = [null];
function _default(node, name) {
  var schedules = node.__transition,
    schedule,
    i;
  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > _schedule.SCHEDULED && schedule.name === name) {
        return new _index.Transition([[node]], root, name, +i);
      }
    }
  }
  return null;
}