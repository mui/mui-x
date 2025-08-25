"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.labelClasses = void 0;
exports.getLabelUtilityClass = getLabelUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getLabelUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsLabel', slot);
}
exports.labelClasses = (0, generateUtilityClasses_1.default)('MuiChartsLabel', ['root']);
var useUtilityClasses = function (props) {
    var slots = {
        root: ['root'],
    };
    return (0, composeClasses_1.default)(slots, getLabelUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;
