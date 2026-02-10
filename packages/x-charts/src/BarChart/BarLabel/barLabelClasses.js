"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.barLabelClasses = void 0;
exports.getBarLabelUtilityClass = getBarLabelUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getBarLabelUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiBarLabel', slot);
}
exports.barLabelClasses = (0, generateUtilityClasses_1.default)('MuiBarLabel', [
    'root',
    'highlighted',
    'faded',
    'animate',
]);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted, skipAnimation = ownerState.skipAnimation;
    var slots = {
        root: [
            'root',
            "series-".concat(seriesId),
            isHighlighted && 'highlighted',
            isFaded && 'faded',
            !skipAnimation && 'animate',
        ],
    };
    return (0, composeClasses_1.default)(slots, getBarLabelUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
