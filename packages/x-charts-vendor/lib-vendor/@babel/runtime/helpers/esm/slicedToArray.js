"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _slicedToArray;
var _arrayWithHoles = _interopRequireDefault(require("./arrayWithHoles.js"));
var _iterableToArrayLimit = _interopRequireDefault(require("./iterableToArrayLimit.js"));
var _unsupportedIterableToArray = _interopRequireDefault(require("./unsupportedIterableToArray.js"));
var _nonIterableRest = _interopRequireDefault(require("./nonIterableRest.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _slicedToArray(r, e) {
  return (0, _arrayWithHoles.default)(r) || (0, _iterableToArrayLimit.default)(r, e) || (0, _unsupportedIterableToArray.default)(r, e) || (0, _nonIterableRest.default)();
}