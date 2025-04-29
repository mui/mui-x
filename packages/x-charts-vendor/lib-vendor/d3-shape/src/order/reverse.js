"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _none = _interopRequireDefault(require("./none.js"));
function _default(series) {
  return (0, _none.default)(series).reverse();
}