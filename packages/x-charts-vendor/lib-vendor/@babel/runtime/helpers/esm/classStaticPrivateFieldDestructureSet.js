"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classStaticPrivateFieldDestructureSet;
var _classApplyDescriptorDestructureSet = _interopRequireDefault(require("./classApplyDescriptorDestructureSet.js"));
var _assertClassBrand = _interopRequireDefault(require("./assertClassBrand.js"));
var _classCheckPrivateStaticFieldDescriptor = _interopRequireDefault(require("./classCheckPrivateStaticFieldDescriptor.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classStaticPrivateFieldDestructureSet(t, r, s) {
  return (0, _assertClassBrand.default)(r, t), (0, _classCheckPrivateStaticFieldDescriptor.default)(s, "set"), (0, _classApplyDescriptorDestructureSet.default)(t, s);
}