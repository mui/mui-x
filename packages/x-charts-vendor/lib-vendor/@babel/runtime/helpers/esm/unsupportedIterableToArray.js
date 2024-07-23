"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _unsupportedIterableToArray;
var _arrayLikeToArray = _interopRequireDefault(require("./arrayLikeToArray.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return (0, _arrayLikeToArray.default)(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? (0, _arrayLikeToArray.default)(r, a) : void 0;
  }
}