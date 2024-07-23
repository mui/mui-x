"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classPrivateFieldInitSpec;
var _checkPrivateRedeclaration = _interopRequireDefault(require("./checkPrivateRedeclaration.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classPrivateFieldInitSpec(e, t, a) {
  (0, _checkPrivateRedeclaration.default)(e, t), t.set(e, a);
}