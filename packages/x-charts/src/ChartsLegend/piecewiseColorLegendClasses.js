"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piecewiseColorLegendClasses = exports.useUtilityClasses = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getLegendUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPiecewiseColorLegendClasses', slot);
}
var useUtilityClasses = function (props) {
    var classes = props.classes, direction = props.direction, labelPosition = props.labelPosition;
    var slots = {
        root: [
            'root',
            direction,
            labelPosition === null || labelPosition === void 0 ? void 0 : labelPosition.replaceAll(/-(\w)/g, function (match) { return match[1].toUpperCase(); }),
        ],
        minLabel: ['minLabel'],
        maxLabel: ['maxLabel'],
        item: ['item'],
        mark: ['mark'],
        label: ['label'],
    };
    return (0, composeClasses_1.default)(slots, getLegendUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
exports.piecewiseColorLegendClasses = (0, generateUtilityClasses_1.default)('MuiPiecewiseColorLegendClasses', [
    'root',
    'minLabel',
    'maxLabel',
    'item',
    'vertical',
    'horizontal',
    'start',
    'end',
    'extremes',
    'inlineStart',
    'inlineEnd',
    'mark',
    'label',
]);
