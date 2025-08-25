"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = void 0;
var composeClasses_1 = require("@mui/utils/composeClasses");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var useUtilityClasses = function (props) {
    var classes = props.classes;
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
    };
    return (0, composeClasses_1.default)(slots, ChartsTooltip_1.getChartsTooltipUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
