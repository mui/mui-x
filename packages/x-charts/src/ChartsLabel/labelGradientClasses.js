"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.labelGradientClasses = void 0;
exports.getLabelGradientUtilityClass = getLabelGradientUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getLabelGradientUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsLabelGradient', slot);
}
exports.labelGradientClasses = (0, generateUtilityClasses_1.default)('MuiChartsLabelGradient', ['root', 'vertical', 'horizontal', 'mask', 'fill']);
var useUtilityClasses = function (props) {
    var direction = props.direction;
    var slots = {
        root: ['root', direction],
        mask: ['mask'],
        fill: ['fill'],
    };
    return (0, composeClasses_1.default)(slots, getLabelGradientUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;
