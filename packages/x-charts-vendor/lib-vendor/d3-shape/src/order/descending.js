"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _ascending = _interopRequireDefault(require("./ascending.js"));
function _default(series) {
  return (0, _ascending.default)(series).reverse();
}