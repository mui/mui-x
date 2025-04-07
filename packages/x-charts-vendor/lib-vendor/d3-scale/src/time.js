"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendar = calendar;
exports.default = time;
var _index = require("../../../lib-vendor/d3-time/src/index.js");
var _index2 = require("../../../lib-vendor/d3-time-format/src/index.js");
var _continuous = _interopRequireWildcard(require("./continuous.js"));
var _init = require("./init.js");
var _nice = _interopRequireDefault(require("./nice.js"));
function date(t) {
  return new Date(t);
}
function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}
function calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format) {
  var scale = (0, _continuous.default)(),
    invert = scale.invert,
    domain = scale.domain;
  var formatMillisecond = format(".%L"),
    formatSecond = format(":%S"),
    formatMinute = format("%I:%M"),
    formatHour = format("%I %p"),
    formatDay = format("%a %d"),
    formatWeek = format("%b %d"),
    formatMonth = format("%B"),
    formatYear = format("%Y");
  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? week(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
  }
  scale.invert = function (y) {
    return new Date(invert(y));
  };
  scale.domain = function (_) {
    return arguments.length ? domain(Array.from(_, number)) : domain().map(date);
  };
  scale.ticks = function (interval) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], interval == null ? 10 : interval);
  };
  scale.tickFormat = function (count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };
  scale.nice = function (interval) {
    var d = domain();
    if (!interval || typeof interval.range !== "function") interval = tickInterval(d[0], d[d.length - 1], interval == null ? 10 : interval);
    return interval ? domain((0, _nice.default)(d, interval)) : scale;
  };
  scale.copy = function () {
    return (0, _continuous.copy)(scale, calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format));
  };
  return scale;
}
function time() {
  return _init.initRange.apply(calendar(_index.timeTicks, _index.timeTickInterval, _index.timeYear, _index.timeMonth, _index.timeWeek, _index.timeDay, _index.timeHour, _index.timeMinute, _index.timeSecond, _index2.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
}