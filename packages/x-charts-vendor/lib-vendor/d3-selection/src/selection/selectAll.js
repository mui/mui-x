"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _index = require("./index.js");
var _array = _interopRequireDefault(require("../array.js"));
var _selectorAll = _interopRequireDefault(require("../selectorAll.js"));
function arrayAll(select) {
  return function () {
    return (0, _array.default)(select.apply(this, arguments));
  };
}
function _default(select) {
  if (typeof select === "function") select = arrayAll(select);else select = (0, _selectorAll.default)(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new _index.Selection(subgroups, parents);
}