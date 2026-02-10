"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.chartsTooltipClasses = void 0;
exports.getChartsTooltipUtilityClass = getChartsTooltipUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getChartsTooltipUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsTooltip', slot);
}
exports.chartsTooltipClasses = (0, generateUtilityClasses_1.default)('MuiChartsTooltip', [
    'root',
    'paper',
    'table',
    'row',
    'cell',
    'mark',
    'markContainer',
    'labelCell',
    'valueCell',
    'axisValueCell',
]);
var useUtilityClasses = function (classes) {
    var slots = {
        root: ['root'],
        paper: ['paper'],
        table: ['table'],
        row: ['row'],
        cell: ['cell'],
        mark: ['mark'],
        markContainer: ['markContainer'],
        labelCell: ['labelCell'],
        valueCell: ['valueCell'],
        axisValueCell: ['axisValueCell'],
    };
    return (0, composeClasses_1.default)(slots, getChartsTooltipUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
