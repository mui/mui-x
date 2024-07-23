"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zip;
var _transpose = _interopRequireDefault(require("./transpose.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function zip() {
  return (0, _transpose.default)(arguments);
}