"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcDays = exports.utcDay = exports.unixDays = exports.unixDay = exports.timeDays = exports.timeDay = void 0;
var _interval = require("./interval.js");
var _duration = require("./duration.js");
const timeDay = exports.timeDay = (0, _interval.timeInterval)(date => date.setHours(0, 0, 0, 0), (date, step) => date.setDate(date.getDate() + step), (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationDay, date => date.getDate() - 1);
const timeDays = exports.timeDays = timeDay.range;
const utcDay = exports.utcDay = (0, _interval.timeInterval)(date => {
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCDate(date.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / _duration.durationDay;
}, date => {
  return date.getUTCDate() - 1;
});
const utcDays = exports.utcDays = utcDay.range;
const unixDay = exports.unixDay = (0, _interval.timeInterval)(date => {
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCDate(date.getUTCDate() + step);
}, (start, end) => {
  return (end - start) / _duration.durationDay;
}, date => {
  return Math.floor(date / _duration.durationDay);
});
const unixDays = exports.unixDays = unixDay.range;