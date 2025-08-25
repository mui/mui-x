"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickersCalendarHeaderClasses = exports.getPickersCalendarHeaderUtilityClass = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var getPickersCalendarHeaderUtilityClass = function (slot) {
    return (0, generateUtilityClass_1.default)('MuiPickersCalendarHeader', slot);
};
exports.getPickersCalendarHeaderUtilityClass = getPickersCalendarHeaderUtilityClass;
exports.pickersCalendarHeaderClasses = (0, generateUtilityClasses_1.default)('MuiPickersCalendarHeader', ['root', 'labelContainer', 'label', 'switchViewButton', 'switchViewIcon']);
