"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setFunctionName;
var _typeof2 = _interopRequireDefault(require("./typeof.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function setFunctionName(e, t, n) {
  "symbol" == (0, _typeof2.default)(t) && (t = (t = t.description) ? "[" + t + "]" : "");
  try {
    Object.defineProperty(e, "name", {
      configurable: !0,
      value: n ? n + " " + t : t
    });
  } catch (e) {}
  return e;
}