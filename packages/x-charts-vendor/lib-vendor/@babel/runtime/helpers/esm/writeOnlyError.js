"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _writeOnlyError;
function _writeOnlyError(r) {
  throw new TypeError('"' + r + '" is write-only');
}