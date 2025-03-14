"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _pointer = _interopRequireDefault(require("./pointer.js"));
var _sourceEvent = _interopRequireDefault(require("./sourceEvent.js"));
function _default(events, node) {
  if (events.target) {
    // i.e., instanceof Event, not TouchList or iterable
    events = (0, _sourceEvent.default)(events);
    if (node === undefined) node = events.currentTarget;
    events = events.touches || [events];
  }
  return Array.from(events, event => (0, _pointer.default)(event, node));
}