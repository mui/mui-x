"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcYears = exports.utcYear = exports.timeYears = exports.timeYear = void 0;
var _interval = require("./interval.js");
const timeYear = exports.timeYear = (0, _interval.timeInterval)(date => {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, (date, step) => {
  date.setFullYear(date.getFullYear() + step);
}, (start, end) => {
  return end.getFullYear() - start.getFullYear();
}, date => {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
timeYear.every = k => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.timeInterval)(date => {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setFullYear(date.getFullYear() + step * k);
  });
};
const timeYears = exports.timeYears = timeYear.range;
const utcYear = exports.utcYear = (0, _interval.timeInterval)(date => {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, (date, step) => {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, (start, end) => {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, date => {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = k => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.timeInterval)(date => {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};
const utcYears = exports.utcYears = utcYear.range;