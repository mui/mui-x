"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _temporalRef;
var _temporalUndefined = _interopRequireDefault(require("./temporalUndefined.js"));
var _tdz = _interopRequireDefault(require("./tdz.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _temporalRef(r, e) {
  return r === _temporalUndefined.default ? (0, _tdz.default)(e) : r;
}