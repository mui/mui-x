"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.continuousColorLegendClasses = exports.useUtilityClasses = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getLegendUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiContinuousColorLegend', slot);
}
var useUtilityClasses = function (props) {
    var classes = props.classes, direction = props.direction, labelPosition = props.labelPosition;
    var slots = {
        root: ['root', direction, labelPosition],
        minLabel: ['minLabel'],
        maxLabel: ['maxLabel'],
        gradient: ['gradient'],
        mark: ['mark'],
        label: ['label'],
    };
    return (0, composeClasses_1.default)(slots, getLegendUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
exports.continuousColorLegendClasses = (0, generateUtilityClasses_1.default)('MuiContinuousColorLegend', [
    'root',
    'minLabel',
    'maxLabel',
    'gradient',
    'vertical',
    'horizontal',
    'start',
    'end',
    'extremes',
    'label',
]);
