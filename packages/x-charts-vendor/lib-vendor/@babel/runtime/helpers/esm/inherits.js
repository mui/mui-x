"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _inherits;
var _setPrototypeOf = _interopRequireDefault(require("./setPrototypeOf.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && (0, _setPrototypeOf.default)(t, e);
}