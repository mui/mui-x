"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _none = _interopRequireDefault(require("./none.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _default(series) {
  return (0, _none.default)(series).reverse();
}