"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transition = Transition;
exports.default = transition;
exports.newId = newId;
var _index = require("../../../../lib-vendor/d3-selection/src/index.js");
var _attr = _interopRequireDefault(require("./attr.js"));
var _attrTween = _interopRequireDefault(require("./attrTween.js"));
var _delay = _interopRequireDefault(require("./delay.js"));
var _duration = _interopRequireDefault(require("./duration.js"));
var _ease = _interopRequireDefault(require("./ease.js"));
var _easeVarying = _interopRequireDefault(require("./easeVarying.js"));
var _filter = _interopRequireDefault(require("./filter.js"));
var _merge = _interopRequireDefault(require("./merge.js"));
var _on = _interopRequireDefault(require("./on.js"));
var _remove = _interopRequireDefault(require("./remove.js"));
var _select = _interopRequireDefault(require("./select.js"));
var _selectAll = _interopRequireDefault(require("./selectAll.js"));
var _selection = _interopRequireDefault(require("./selection.js"));
var _style = _interopRequireDefault(require("./style.js"));
var _styleTween = _interopRequireDefault(require("./styleTween.js"));
var _text = _interopRequireDefault(require("./text.js"));
var _textTween = _interopRequireDefault(require("./textTween.js"));
var _transition = _interopRequireDefault(require("./transition.js"));
var _tween = _interopRequireDefault(require("./tween.js"));
var _end = _interopRequireDefault(require("./end.js"));
var id = 0;
function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}
function transition(name) {
  return (0, _index.selection)().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = _index.selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: _select.default,
  selectAll: _selectAll.default,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: _filter.default,
  merge: _merge.default,
  selection: _selection.default,
  transition: _transition.default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: _on.default,
  attr: _attr.default,
  attrTween: _attrTween.default,
  style: _style.default,
  styleTween: _styleTween.default,
  text: _text.default,
  textTween: _textTween.default,
  remove: _remove.default,
  tween: _tween.default,
  delay: _delay.default,
  duration: _duration.default,
  ease: _ease.default,
  easeVarying: _easeVarying.default,
  end: _end.default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};