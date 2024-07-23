"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _get;
var _superPropBase = _interopRequireDefault(require("./superPropBase.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _get() {
  return exports.default = _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = (0, _superPropBase.default)(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}