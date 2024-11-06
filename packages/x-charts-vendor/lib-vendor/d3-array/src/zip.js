"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zip;
var _transpose = _interopRequireDefault(require("./transpose.js"));
function zip() {
  return (0, _transpose.default)(arguments);
}