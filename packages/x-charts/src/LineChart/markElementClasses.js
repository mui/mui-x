"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.markElementClasses = void 0;
exports.getMarkElementUtilityClass = getMarkElementUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
/**
 * @deprecated Use `getLineUtilityClass` from `./lineClasses` instead.
 */
function getMarkElementUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiMarkElement', slot);
}
/**
 * @deprecated Use `lineClasses` from `./lineClasses` instead.
 */
exports.markElementClasses = (0, generateUtilityClasses_1.default)('MuiMarkElement', [
    'root',
    'highlighted',
    'faded',
    'animate',
    'series',
]);
/**
 * @deprecated Use `useUtilityClasses` from `./lineClasses` instead.
 */
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted, skipAnimation = ownerState.skipAnimation;
    var slots = {
        root: [
            'root',
            "series-".concat(seriesId),
            isHighlighted && 'highlighted',
            isFaded && 'faded',
            skipAnimation ? undefined : 'animate',
        ],
    };
    return (0, composeClasses_1.default)(slots, getMarkElementUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
