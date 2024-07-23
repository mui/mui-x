"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _readOnlyError;
function _readOnlyError(r) {
  throw new TypeError('"' + r + '" is read-only');
}