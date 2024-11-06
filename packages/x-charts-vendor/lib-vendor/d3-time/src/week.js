"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcWednesdays = exports.utcWednesday = exports.utcTuesdays = exports.utcTuesday = exports.utcThursdays = exports.utcThursday = exports.utcSundays = exports.utcSunday = exports.utcSaturdays = exports.utcSaturday = exports.utcMondays = exports.utcMonday = exports.utcFridays = exports.utcFriday = exports.timeWednesdays = exports.timeWednesday = exports.timeTuesdays = exports.timeTuesday = exports.timeThursdays = exports.timeThursday = exports.timeSundays = exports.timeSunday = exports.timeSaturdays = exports.timeSaturday = exports.timeMondays = exports.timeMonday = exports.timeFridays = exports.timeFriday = void 0;
var _interval = require("./interval.js");
var _duration = require("./duration.js");
function timeWeekday(i) {
  return (0, _interval.timeInterval)(date => {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setDate(date.getDate() + step * 7);
  }, (start, end) => {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationWeek;
  });
}
const timeSunday = exports.timeSunday = timeWeekday(0);
const timeMonday = exports.timeMonday = timeWeekday(1);
const timeTuesday = exports.timeTuesday = timeWeekday(2);
const timeWednesday = exports.timeWednesday = timeWeekday(3);
const timeThursday = exports.timeThursday = timeWeekday(4);
const timeFriday = exports.timeFriday = timeWeekday(5);
const timeSaturday = exports.timeSaturday = timeWeekday(6);
const timeSundays = exports.timeSundays = timeSunday.range;
const timeMondays = exports.timeMondays = timeMonday.range;
const timeTuesdays = exports.timeTuesdays = timeTuesday.range;
const timeWednesdays = exports.timeWednesdays = timeWednesday.range;
const timeThursdays = exports.timeThursdays = timeThursday.range;
const timeFridays = exports.timeFridays = timeFriday.range;
const timeSaturdays = exports.timeSaturdays = timeSaturday.range;
function utcWeekday(i) {
  return (0, _interval.timeInterval)(date => {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, (date, step) => {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, (start, end) => {
    return (end - start) / _duration.durationWeek;
  });
}
const utcSunday = exports.utcSunday = utcWeekday(0);
const utcMonday = exports.utcMonday = utcWeekday(1);
const utcTuesday = exports.utcTuesday = utcWeekday(2);
const utcWednesday = exports.utcWednesday = utcWeekday(3);
const utcThursday = exports.utcThursday = utcWeekday(4);
const utcFriday = exports.utcFriday = utcWeekday(5);
const utcSaturday = exports.utcSaturday = utcWeekday(6);
const utcSundays = exports.utcSundays = utcSunday.range;
const utcMondays = exports.utcMondays = utcMonday.range;
const utcTuesdays = exports.utcTuesdays = utcTuesday.range;
const utcWednesdays = exports.utcWednesdays = utcWednesday.range;
const utcThursdays = exports.utcThursdays = utcThursday.range;
const utcFridays = exports.utcFridays = utcFriday.range;
const utcSaturdays = exports.utcSaturdays = utcSaturday.range;