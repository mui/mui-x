"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _possibleConstructorReturn;
var _typeof2 = _interopRequireDefault(require("./typeof.js"));
var _assertThisInitialized = _interopRequireDefault(require("./assertThisInitialized.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == (0, _typeof2.default)(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return (0, _assertThisInitialized.default)(t);
}