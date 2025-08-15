"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.center = center;
exports.justify = justify;
exports.left = left;
exports.right = right;
var _index = require("../../../lib-vendor/d3-array/src/index.js");
function targetDepth(d) {
  return d.target.depth;
}
function left(node) {
  return node.depth;
}
function right(node, n) {
  return n - 1 - node.height;
}
function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}
function center(node) {
  return node.targetLinks.length ? node.depth : node.sourceLinks.length ? (0, _index.min)(node.sourceLinks, targetDepth) - 1 : 0;
}