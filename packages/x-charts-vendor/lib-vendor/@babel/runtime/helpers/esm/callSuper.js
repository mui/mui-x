"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _callSuper;
var _getPrototypeOf = _interopRequireDefault(require("./getPrototypeOf.js"));
var _isNativeReflectConstruct = _interopRequireDefault(require("./isNativeReflectConstruct.js"));
var _possibleConstructorReturn = _interopRequireDefault(require("./possibleConstructorReturn.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _callSuper(t, o, e) {
  return o = (0, _getPrototypeOf.default)(o), (0, _possibleConstructorReturn.default)(t, (0, _isNativeReflectConstruct.default)() ? Reflect.construct(o, e || [], (0, _getPrototypeOf.default)(t).constructor) : o.apply(t, e));
}