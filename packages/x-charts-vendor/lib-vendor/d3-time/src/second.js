"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seconds = exports.second = void 0;
var _interval = require("./interval.js");
var _duration = require("./duration.js");
const second = exports.second = (0, _interval.timeInterval)(date => {
  date.setTime(date - date.getMilliseconds());
}, (date, step) => {
  date.setTime(+date + step * _duration.durationSecond);
}, (start, end) => {
  return (end - start) / _duration.durationSecond;
}, date => {
  return date.getUTCSeconds();
});
const seconds = exports.seconds = second.range;