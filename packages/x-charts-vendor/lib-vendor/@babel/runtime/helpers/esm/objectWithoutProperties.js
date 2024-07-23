"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _objectWithoutProperties;
var _objectWithoutPropertiesLoose = _interopRequireDefault(require("./objectWithoutPropertiesLoose.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = (0, _objectWithoutPropertiesLoose.default)(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}