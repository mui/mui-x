"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMonths = exports.utcMonth = exports.timeMonths = exports.timeMonth = void 0;
var _interval = require("./interval.js");
const timeMonth = exports.timeMonth = (0, _interval.timeInterval)(date => {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, (date, step) => {
  date.setMonth(date.getMonth() + step);
}, (start, end) => {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, date => {
  return date.getMonth();
});
const timeMonths = exports.timeMonths = timeMonth.range;
const utcMonth = exports.utcMonth = (0, _interval.timeInterval)(date => {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCMonth(date.getUTCMonth() + step);
}, (start, end) => {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, date => {
  return date.getUTCMonth();
});
const utcMonths = exports.utcMonths = utcMonth.range;