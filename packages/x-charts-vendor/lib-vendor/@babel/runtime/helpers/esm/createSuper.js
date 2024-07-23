"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _createSuper;
var _getPrototypeOf = _interopRequireDefault(require("./getPrototypeOf.js"));
var _isNativeReflectConstruct = _interopRequireDefault(require("./isNativeReflectConstruct.js"));
var _possibleConstructorReturn = _interopRequireDefault(require("./possibleConstructorReturn.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _createSuper(t) {
  var r = (0, _isNativeReflectConstruct.default)();
  return function () {
    var e,
      o = (0, _getPrototypeOf.default)(t);
    if (r) {
      var s = (0, _getPrototypeOf.default)(this).constructor;
      e = Reflect.construct(o, arguments, s);
    } else e = o.apply(this, arguments);
    return (0, _possibleConstructorReturn.default)(this, e);
  };
}