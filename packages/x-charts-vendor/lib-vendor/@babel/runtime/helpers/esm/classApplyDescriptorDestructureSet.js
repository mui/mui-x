"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classApplyDescriptorDestructureSet;
function _classApplyDescriptorDestructureSet(e, t) {
  if (t.set) return "__destrObj" in t || (t.__destrObj = {
    set value(r) {
      t.set.call(e, r);
    }
  }), t.__destrObj;
  if (!t.writable) throw new TypeError("attempted to set read only private field");
  return t;
}