"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _creator = _interopRequireDefault(require("./creator.js"));
var _select = _interopRequireDefault(require("./select.js"));
function _default(name) {
  return (0, _select.default)((0, _creator.default)(name).call(document.documentElement));
}