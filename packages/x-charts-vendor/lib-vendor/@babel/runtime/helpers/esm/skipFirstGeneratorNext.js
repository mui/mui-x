"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _skipFirstGeneratorNext;
function _skipFirstGeneratorNext(t) {
  return function () {
    var r = t.apply(this, arguments);
    return r.next(), r;
  };
}