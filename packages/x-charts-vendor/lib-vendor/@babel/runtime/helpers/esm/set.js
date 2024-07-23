"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _set;
var _superPropBase = _interopRequireDefault(require("./superPropBase.js"));
var _defineProperty = _interopRequireDefault(require("./defineProperty.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function set(e, r, t, o) {
  return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function (e, r, t, o) {
    var f,
      i = (0, _superPropBase.default)(e, r);
    if (i) {
      if ((f = Object.getOwnPropertyDescriptor(i, r)).set) return f.set.call(o, t), !0;
      if (!f.writable) return !1;
    }
    if (f = Object.getOwnPropertyDescriptor(o, r)) {
      if (!f.writable) return !1;
      f.value = t, Object.defineProperty(o, r, f);
    } else (0, _defineProperty.default)(o, r, t);
    return !0;
  }, set(e, r, t, o);
}
function _set(e, r, t, o, f) {
  if (!set(e, r, t, o || e) && f) throw new TypeError("failed to set property");
  return t;
}