"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _isNativeReflectConstruct;
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (exports.default = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}