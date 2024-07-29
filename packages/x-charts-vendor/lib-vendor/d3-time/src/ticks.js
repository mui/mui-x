"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcTicks = exports.utcTickInterval = exports.timeTicks = exports.timeTickInterval = void 0;
var _index = require("../../../lib-vendor/d3-array/src/index.js");
var _duration = require("./duration.js");
var _millisecond = require("./millisecond.js");
var _second = require("./second.js");
var _minute = require("./minute.js");
var _hour = require("./hour.js");
var _day = require("./day.js");
var _week = require("./week.js");
var _month = require("./month.js");
var _year = require("./year.js");
function ticker(year, month, week, day, hour, minute) {
  const tickIntervals = [[_second.second, 1, _duration.durationSecond], [_second.second, 5, 5 * _duration.durationSecond], [_second.second, 15, 15 * _duration.durationSecond], [_second.second, 30, 30 * _duration.durationSecond], [minute, 1, _duration.durationMinute], [minute, 5, 5 * _duration.durationMinute], [minute, 15, 15 * _duration.durationMinute], [minute, 30, 30 * _duration.durationMinute], [hour, 1, _duration.durationHour], [hour, 3, 3 * _duration.durationHour], [hour, 6, 6 * _duration.durationHour], [hour, 12, 12 * _duration.durationHour], [day, 1, _duration.durationDay], [day, 2, 2 * _duration.durationDay], [week, 1, _duration.durationWeek], [month, 1, _duration.durationMonth], [month, 3, 3 * _duration.durationMonth], [year, 1, _duration.durationYear]];
  function ticks(start, stop, count) {
    const reverse = stop < start;
    if (reverse) [start, stop] = [stop, start];
    const interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
    const ticks = interval ? interval.range(start, +stop + 1) : []; // inclusive stop
    return reverse ? ticks.reverse() : ticks;
  }
  function tickInterval(start, stop, count) {
    const target = Math.abs(stop - start) / count;
    const i = (0, _index.bisector)(([,, step]) => step).right(tickIntervals, target);
    if (i === tickIntervals.length) return year.every((0, _index.tickStep)(start / _duration.durationYear, stop / _duration.durationYear, count));
    if (i === 0) return _millisecond.millisecond.every(Math.max((0, _index.tickStep)(start, stop, count), 1));
    const [t, step] = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
    return t.every(step);
  }
  return [ticks, tickInterval];
}
const [utcTicks, utcTickInterval] = ticker(_year.utcYear, _month.utcMonth, _week.utcSunday, _day.unixDay, _hour.utcHour, _minute.utcMinute);
exports.utcTickInterval = utcTickInterval;
exports.utcTicks = utcTicks;
const [timeTicks, timeTickInterval] = ticker(_year.timeYear, _month.timeMonth, _week.timeSunday, _day.timeDay, _hour.timeHour, _minute.timeMinute);
exports.timeTickInterval = timeTickInterval;
exports.timeTicks = timeTicks;