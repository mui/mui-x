"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("../../../lib-vendor/d3-color/src/index.js");
var _rgb = _interopRequireDefault(require("./rgb.js"));
var _array = require("./array.js");
var _date = _interopRequireDefault(require("./date.js"));
var _number = _interopRequireDefault(require("./number.js"));
var _object = _interopRequireDefault(require("./object.js"));
var _string = _interopRequireDefault(require("./string.js"));
var _constant = _interopRequireDefault(require("./constant.js"));
var _numberArray = _interopRequireWildcard(require("./numberArray.js"));
function _default(a, b) {
  var t = typeof b,
    c;
  return b == null || t === "boolean" ? (0, _constant.default)(b) : (t === "number" ? _number.default : t === "string" ? (c = (0, _index.color)(b)) ? (b = c, _rgb.default) : _string.default : b instanceof _index.color ? _rgb.default : b instanceof Date ? _date.default : (0, _numberArray.isNumberArray)(b) ? _numberArray.default : Array.isArray(b) ? _array.genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? _object.default : _number.default)(a, b);
}