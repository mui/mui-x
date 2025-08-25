"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHours = exports.getMinutes = exports.CLOCK_HOUR_WIDTH = exports.CLOCK_WIDTH = void 0;
exports.CLOCK_WIDTH = 220;
exports.CLOCK_HOUR_WIDTH = 36;
var clockCenter = {
    x: exports.CLOCK_WIDTH / 2,
    y: exports.CLOCK_WIDTH / 2,
};
var baseClockPoint = {
    x: clockCenter.x,
    y: 0,
};
var cx = baseClockPoint.x - clockCenter.x;
var cy = baseClockPoint.y - clockCenter.y;
var rad2deg = function (rad) { return rad * (180 / Math.PI); };
var getAngleValue = function (step, offsetX, offsetY) {
    var x = offsetX - clockCenter.x;
    var y = offsetY - clockCenter.y;
    var atan = Math.atan2(cx, cy) - Math.atan2(x, y);
    var deg = rad2deg(atan);
    deg = Math.round(deg / step) * step;
    deg %= 360;
    var value = Math.floor(deg / step) || 0;
    var delta = Math.pow(x, 2) + Math.pow(y, 2);
    var distance = Math.sqrt(delta);
    return { value: value, distance: distance };
};
var getMinutes = function (offsetX, offsetY, step) {
    if (step === void 0) { step = 1; }
    var angleStep = step * 6;
    var value = getAngleValue(angleStep, offsetX, offsetY).value;
    value = (value * step) % 60;
    return value;
};
exports.getMinutes = getMinutes;
var getHours = function (offsetX, offsetY, ampm) {
    var _a = getAngleValue(30, offsetX, offsetY), value = _a.value, distance = _a.distance;
    var hour = value || 12;
    if (!ampm) {
        if (distance < exports.CLOCK_WIDTH / 2 - exports.CLOCK_HOUR_WIDTH) {
            hour += 12;
            hour %= 24;
        }
    }
    else {
        hour %= 12;
    }
    return hour;
};
exports.getHours = getHours;
