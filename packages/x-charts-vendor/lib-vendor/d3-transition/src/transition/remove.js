"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function removeFunction(id) {
  return function () {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}
function _default() {
  return this.on("end.remove", removeFunction(this._id));
}