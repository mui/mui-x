"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersToolbarTextClasses = void 0;
exports.getPickersToolbarTextUtilityClass = getPickersToolbarTextUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersToolbarTextUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersToolbarText', slot);
}
exports.pickersToolbarTextClasses = (0, generateUtilityClasses_1.default)('MuiPickersToolbarText', ['root']);
