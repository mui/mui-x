"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.scatterClasses = void 0;
exports.getScatterUtilityClass = getScatterUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getScatterUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiScatterChart', slot);
}
exports.scatterClasses = (0, generateUtilityClasses_1.default)('MuiScatterChart', ['root']);
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, getScatterUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
