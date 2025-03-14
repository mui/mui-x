"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("../../../../lib-vendor/d3-selection/src/index.js");
var Selection = _index.selection.prototype.constructor;
function _default() {
  return new Selection(this._groups, this._parents);
}