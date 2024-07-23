"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Delaunay", {
  enumerable: true,
  get: function () {
    return _delaunay.default;
  }
});
Object.defineProperty(exports, "Voronoi", {
  enumerable: true,
  get: function () {
    return _voronoi.default;
  }
});
var _delaunay = _interopRequireDefault(require("./delaunay.js"));
var _voronoi = _interopRequireDefault(require("./voronoi.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }