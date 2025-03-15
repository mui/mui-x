"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _sparse = _interopRequireDefault(require("./sparse.js"));
var _index = require("./index.js");
function _default() {
  return new _index.Selection(this._exit || this._groups.map(_sparse.default), this._parents);
}