"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = subset;
var _superset = _interopRequireDefault(require("./superset.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function subset(values, other) {
  return (0, _superset.default)(other, values);
}