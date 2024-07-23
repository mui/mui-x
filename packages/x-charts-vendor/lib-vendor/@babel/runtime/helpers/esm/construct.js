"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _construct;
var _isNativeReflectConstruct = _interopRequireDefault(require("./isNativeReflectConstruct.js"));
var _setPrototypeOf = _interopRequireDefault(require("./setPrototypeOf.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _construct(t, e, r) {
  if ((0, _isNativeReflectConstruct.default)()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && (0, _setPrototypeOf.default)(p, r.prototype), p;
}