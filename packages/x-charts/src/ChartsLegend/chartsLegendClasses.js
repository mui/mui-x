"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legendClasses = exports.useUtilityClasses = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getLegendUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsLegend', slot);
}
var useUtilityClasses = function (props) {
    var classes = props.classes, direction = props.direction;
    var slots = {
        root: ['root', direction],
        item: ['item'],
        mark: ['mark'],
        label: ['label'],
        series: ['series'],
        hidden: ['hidden'],
    };
    return (0, composeClasses_1.default)(slots, getLegendUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
exports.legendClasses = (0, generateUtilityClasses_1.default)('MuiChartsLegend', [
    'root',
    'item',
    'series',
    'mark',
    'label',
    'vertical',
    'horizontal',
    'hidden',
]);
