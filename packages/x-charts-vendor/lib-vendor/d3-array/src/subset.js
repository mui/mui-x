"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = subset;
var _superset = _interopRequireDefault(require("./superset.js"));
function subset(values, other) {
  return (0, _superset.default)(other, values);
}