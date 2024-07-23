"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _arrayWithoutHoles;
var _arrayLikeToArray = _interopRequireDefault(require("./arrayLikeToArray.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return (0, _arrayLikeToArray.default)(r);
}