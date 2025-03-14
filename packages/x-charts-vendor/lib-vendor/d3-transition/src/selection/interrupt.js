"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _interrupt = _interopRequireDefault(require("../interrupt.js"));
function _default(name) {
  return this.each(function () {
    (0, _interrupt.default)(this, name);
  });
}