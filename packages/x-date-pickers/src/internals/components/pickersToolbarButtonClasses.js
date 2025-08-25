"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersToolbarButtonClasses = void 0;
exports.getPickersToolbarButtonUtilityClass = getPickersToolbarButtonUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersToolbarButtonUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersToolbarButton', slot);
}
exports.pickersToolbarButtonClasses = (0, generateUtilityClasses_1.default)('MuiPickersToolbarButton', [
    'root',
]);
