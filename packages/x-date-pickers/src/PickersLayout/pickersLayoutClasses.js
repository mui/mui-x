"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersLayoutClasses = void 0;
exports.getPickersLayoutUtilityClass = getPickersLayoutUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getPickersLayoutUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersLayout', slot);
}
exports.pickersLayoutClasses = (0, generateUtilityClasses_1.default)('MuiPickersLayout', ['root', 'landscape', 'contentWrapper', 'toolbar', 'actionBar', 'tabs', 'shortcuts']);
