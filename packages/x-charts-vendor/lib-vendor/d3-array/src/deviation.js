"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deviation;
var _variance = _interopRequireDefault(require("./variance.js"));
function deviation(values, valueof) {
  const v = (0, _variance.default)(values, valueof);
  return v ? Math.sqrt(v) : v;
}