"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.chartsAxisClasses = void 0;
exports.getRadarAxisUtilityClass = getRadarAxisUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRadarAxisUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRadarAxis', slot);
}
exports.chartsAxisClasses = (0, generateUtilityClasses_1.default)('MuiRadarAxis', [
    'root',
    'line',
    'label',
]);
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        line: ['line'],
        label: ['label'],
    };
    return (0, composeClasses_1.default)(slots, getRadarAxisUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
