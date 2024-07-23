"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _wrapNativeSuper;
var _getPrototypeOf = _interopRequireDefault(require("./getPrototypeOf.js"));
var _setPrototypeOf = _interopRequireDefault(require("./setPrototypeOf.js"));
var _isNativeFunction = _interopRequireDefault(require("./isNativeFunction.js"));
var _construct = _interopRequireDefault(require("./construct.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return exports.default = _wrapNativeSuper = function _wrapNativeSuper(t) {
    if (null === t || !(0, _isNativeFunction.default)(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return (0, _construct.default)(t, arguments, (0, _getPrototypeOf.default)(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), (0, _setPrototypeOf.default)(Wrapper, t);
  }, _wrapNativeSuper(t);
}