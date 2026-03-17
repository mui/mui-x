"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMinutes = exports.utcMinute = exports.timeMinutes = exports.timeMinute = void 0;
var _interval = require("./interval.js");
var _duration = require("./duration.js");
const timeMinute = exports.timeMinute = (0, _interval.timeInterval)(date => {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond);
}, (date, step) => {
  date.setTime(+date + step * _duration.durationMinute);
}, (start, end) => {
  return (end - start) / _duration.durationMinute;
}, date => {
  return date.getMinutes();
});
const timeMinutes = exports.timeMinutes = timeMinute.range;
const utcMinute = exports.utcMinute = (0, _interval.timeInterval)(date => {
  date.setUTCSeconds(0, 0);
}, (date, step) => {
  date.setTime(+date + step * _duration.durationMinute);
}, (start, end) => {
  return (end - start) / _duration.durationMinute;
}, date => {
  return date.getUTCMinutes();
});
const utcMinutes = exports.utcMinutes = utcMinute.range;