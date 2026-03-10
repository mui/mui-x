"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.barElementClasses = void 0;
exports.getBarElementUtilityClass = getBarElementUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
/**
 * @deprecated Use `getBarUtilityClass` from `./barClasses` instead.
 */
function getBarElementUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiBarElement', slot);
}
/**
 * @deprecated Use `barClasses` from `./barClasses` instead.
 */
exports.barElementClasses = (0, generateUtilityClasses_1.default)('MuiBarElement', [
    'root',
    'highlighted',
    'faded',
    'series',
]);
/**
 * @deprecated Use `useBarElementUtilityClasses` from `./barClasses` instead.
 */
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isHighlighted = ownerState.isHighlighted, isFaded = ownerState.isFaded;
    var slots = {
        root: ['root', "series-".concat(seriesId), isHighlighted && 'highlighted', isFaded && 'faded'],
    };
    return (0, composeClasses_1.default)(slots, getBarElementUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
