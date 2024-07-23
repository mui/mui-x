"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _tdzError;
function _tdzError(e) {
  throw new ReferenceError(e + " is not defined - temporal dead zone");
}