"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = Selection;
exports.root = exports.default = void 0;
var _select = _interopRequireDefault(require("./select.js"));
var _selectAll = _interopRequireDefault(require("./selectAll.js"));
var _selectChild = _interopRequireDefault(require("./selectChild.js"));
var _selectChildren = _interopRequireDefault(require("./selectChildren.js"));
var _filter = _interopRequireDefault(require("./filter.js"));
var _data = _interopRequireDefault(require("./data.js"));
var _enter = _interopRequireDefault(require("./enter.js"));
var _exit = _interopRequireDefault(require("./exit.js"));
var _join = _interopRequireDefault(require("./join.js"));
var _merge = _interopRequireDefault(require("./merge.js"));
var _order = _interopRequireDefault(require("./order.js"));
var _sort = _interopRequireDefault(require("./sort.js"));
var _call = _interopRequireDefault(require("./call.js"));
var _nodes = _interopRequireDefault(require("./nodes.js"));
var _node = _interopRequireDefault(require("./node.js"));
var _size = _interopRequireDefault(require("./size.js"));
var _empty = _interopRequireDefault(require("./empty.js"));
var _each = _interopRequireDefault(require("./each.js"));
var _attr = _interopRequireDefault(require("./attr.js"));
var _style = _interopRequireDefault(require("./style.js"));
var _property = _interopRequireDefault(require("./property.js"));
var _classed = _interopRequireDefault(require("./classed.js"));
var _text = _interopRequireDefault(require("./text.js"));
var _html = _interopRequireDefault(require("./html.js"));
var _raise = _interopRequireDefault(require("./raise.js"));
var _lower = _interopRequireDefault(require("./lower.js"));
var _append = _interopRequireDefault(require("./append.js"));
var _insert = _interopRequireDefault(require("./insert.js"));
var _remove = _interopRequireDefault(require("./remove.js"));
var _clone = _interopRequireDefault(require("./clone.js"));
var _datum = _interopRequireDefault(require("./datum.js"));
var _on = _interopRequireDefault(require("./on.js"));
var _dispatch = _interopRequireDefault(require("./dispatch.js"));
var _iterator = _interopRequireDefault(require("./iterator.js"));
var root = exports.root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select.default,
  selectAll: _selectAll.default,
  selectChild: _selectChild.default,
  selectChildren: _selectChildren.default,
  filter: _filter.default,
  data: _data.default,
  enter: _enter.default,
  exit: _exit.default,
  join: _join.default,
  merge: _merge.default,
  selection: selection_selection,
  order: _order.default,
  sort: _sort.default,
  call: _call.default,
  nodes: _nodes.default,
  node: _node.default,
  size: _size.default,
  empty: _empty.default,
  each: _each.default,
  attr: _attr.default,
  style: _style.default,
  property: _property.default,
  classed: _classed.default,
  text: _text.default,
  html: _html.default,
  raise: _raise.default,
  lower: _lower.default,
  append: _append.default,
  insert: _insert.default,
  remove: _remove.default,
  clone: _clone.default,
  datum: _datum.default,
  on: _on.default,
  dispatch: _dispatch.default,
  [Symbol.iterator]: _iterator.default
};
var _default = exports.default = selection;