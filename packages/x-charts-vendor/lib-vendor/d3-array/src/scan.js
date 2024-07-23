"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scan;
var _leastIndex = _interopRequireDefault(require("./leastIndex.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function scan(values, compare) {
  const index = (0, _leastIndex.default)(values, compare);
  return index < 0 ? undefined : index;
}