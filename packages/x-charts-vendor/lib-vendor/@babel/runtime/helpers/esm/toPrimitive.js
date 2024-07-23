"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toPrimitive;
var _typeof2 = _interopRequireDefault(require("./typeof.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function toPrimitive(t, r) {
  if ("object" != (0, _typeof2.default)(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0, _typeof2.default)(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}