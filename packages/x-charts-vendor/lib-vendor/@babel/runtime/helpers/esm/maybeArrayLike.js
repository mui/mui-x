"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _maybeArrayLike;
var _arrayLikeToArray = _interopRequireDefault(require("./arrayLikeToArray.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _maybeArrayLike(r, a, e) {
  if (a && !Array.isArray(a) && "number" == typeof a.length) {
    var y = a.length;
    return (0, _arrayLikeToArray.default)(a, void 0 !== e && e < y ? e : y);
  }
  return r(a, e);
}