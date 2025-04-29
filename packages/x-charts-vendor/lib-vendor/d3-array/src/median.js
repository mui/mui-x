"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = median;
exports.medianIndex = medianIndex;
var _quantile = _interopRequireWildcard(require("./quantile.js"));
function median(values, valueof) {
  return (0, _quantile.default)(values, 0.5, valueof);
}
function medianIndex(values, valueof) {
  return (0, _quantile.quantileIndex)(values, 0.5, valueof);
}