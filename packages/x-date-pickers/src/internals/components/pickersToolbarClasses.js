"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersToolbarClasses = void 0;
exports.getPickersToolbarUtilityClass = getPickersToolbarUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersToolbarUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersToolbar', slot);
}
exports.pickersToolbarClasses = (0, generateUtilityClasses_1.default)('MuiPickersToolbar', [
    'root',
    'title',
    'content',
]);
