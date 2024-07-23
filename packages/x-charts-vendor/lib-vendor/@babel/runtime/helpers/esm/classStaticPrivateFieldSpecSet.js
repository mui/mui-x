"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classStaticPrivateFieldSpecSet;
var _classApplyDescriptorSet = _interopRequireDefault(require("./classApplyDescriptorSet.js"));
var _assertClassBrand = _interopRequireDefault(require("./assertClassBrand.js"));
var _classCheckPrivateStaticFieldDescriptor = _interopRequireDefault(require("./classCheckPrivateStaticFieldDescriptor.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classStaticPrivateFieldSpecSet(s, t, r, e) {
  return (0, _assertClassBrand.default)(t, s), (0, _classCheckPrivateStaticFieldDescriptor.default)(r, "set"), (0, _classApplyDescriptorSet.default)(s, r, e), e;
}