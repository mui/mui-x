"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersTextFieldClasses = void 0;
exports.getPickersTextFieldUtilityClass = getPickersTextFieldUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersTextFieldUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersTextField', slot);
}
exports.pickersTextFieldClasses = (0, generateUtilityClasses_1.default)('MuiPickersTextField', ['root', 'focused', 'disabled', 'error', 'required']);
