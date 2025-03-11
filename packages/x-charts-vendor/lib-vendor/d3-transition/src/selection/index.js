"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _index = require("../../../../lib-vendor/d3-selection/src/index.js");
var _interrupt = _interopRequireDefault(require("./interrupt.js"));
var _transition = _interopRequireDefault(require("./transition.js"));
_index.selection.prototype.interrupt = _interrupt.default;
_index.selection.prototype.transition = _transition.default;