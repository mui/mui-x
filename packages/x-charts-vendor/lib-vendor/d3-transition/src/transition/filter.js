"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("../../../../lib-vendor/d3-selection/src/index.js");
var _index2 = require("./index.js");
function _default(match) {
  if (typeof match !== "function") match = (0, _index.matcher)(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new _index2.Transition(subgroups, this._parents, this._name, this._id);
}