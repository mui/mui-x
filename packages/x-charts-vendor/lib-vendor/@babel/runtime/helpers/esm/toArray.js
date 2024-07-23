"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _toArray;
var _arrayWithHoles = _interopRequireDefault(require("./arrayWithHoles.js"));
var _iterableToArray = _interopRequireDefault(require("./iterableToArray.js"));
var _unsupportedIterableToArray = _interopRequireDefault(require("./unsupportedIterableToArray.js"));
var _nonIterableRest = _interopRequireDefault(require("./nonIterableRest.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _toArray(r) {
  return (0, _arrayWithHoles.default)(r) || (0, _iterableToArray.default)(r) || (0, _unsupportedIterableToArray.default)(r) || (0, _nonIterableRest.default)();
}