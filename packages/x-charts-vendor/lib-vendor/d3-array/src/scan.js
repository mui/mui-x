"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scan;
var _leastIndex = _interopRequireDefault(require("./leastIndex.js"));
function scan(values, compare) {
  const index = (0, _leastIndex.default)(values, compare);
  return index < 0 ? undefined : index;
}