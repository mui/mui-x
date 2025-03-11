"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _creator = _interopRequireDefault(require("../creator.js"));
var _selector = _interopRequireDefault(require("../selector.js"));
function constantNull() {
  return null;
}
function _default(name, before) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name),
    select = before == null ? constantNull : typeof before === "function" ? before : (0, _selector.default)(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}