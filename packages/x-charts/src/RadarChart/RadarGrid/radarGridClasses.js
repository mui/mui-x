"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.chartsGridClasses = void 0;
exports.getRadarGridUtilityClass = getRadarGridUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getRadarGridUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiRadarGrid', slot);
}
exports.chartsGridClasses = (0, generateUtilityClasses_1.default)('MuiRadarGrid', [
    'radial',
    'divider',
    'stripe',
]);
var useUtilityClasses = function (classes) {
    var slots = {
        radial: ['radial'],
        divider: ['divider'],
        stripe: ['stripe'],
    };
    return (0, composeClasses_1.default)(slots, getRadarGridUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
