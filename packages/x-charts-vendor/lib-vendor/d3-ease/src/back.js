"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backOut = exports.backInOut = exports.backIn = void 0;
var overshoot = 1.70158;
var backIn = exports.backIn = function custom(s) {
  s = +s;
  function backIn(t) {
    return (t = +t) * t * (s * (t - 1) + t);
  }
  backIn.overshoot = custom;
  return backIn;
}(overshoot);
var backOut = exports.backOut = function custom(s) {
  s = +s;
  function backOut(t) {
    return --t * t * ((t + 1) * s + t) + 1;
  }
  backOut.overshoot = custom;
  return backOut;
}(overshoot);
var backInOut = exports.backInOut = function custom(s) {
  s = +s;
  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }
  backInOut.overshoot = custom;
  return backInOut;
}(overshoot);