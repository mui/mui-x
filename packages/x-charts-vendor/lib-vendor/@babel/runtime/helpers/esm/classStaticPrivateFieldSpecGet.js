"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _classStaticPrivateFieldSpecGet;
var _classApplyDescriptorGet = _interopRequireDefault(require("./classApplyDescriptorGet.js"));
var _assertClassBrand = _interopRequireDefault(require("./assertClassBrand.js"));
var _classCheckPrivateStaticFieldDescriptor = _interopRequireDefault(require("./classCheckPrivateStaticFieldDescriptor.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _classStaticPrivateFieldSpecGet(t, s, r) {
  return (0, _assertClassBrand.default)(s, t), (0, _classCheckPrivateStaticFieldDescriptor.default)(r, "get"), (0, _classApplyDescriptorGet.default)(t, r);
}