"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersInputClasses = void 0;
exports.getPickersInputUtilityClass = getPickersInputUtilityClass;
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var PickersInputBase_1 = require("../PickersInputBase");
function getPickersInputUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersFilledInput', slot);
}
exports.pickersInputClasses = __assign(__assign({}, PickersInputBase_1.pickersInputBaseClasses), (0, generateUtilityClasses_1.default)('MuiPickersInput', ['root', 'underline', 'input']));
