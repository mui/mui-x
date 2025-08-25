"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funnelSectionClasses = exports.useLabelUtilityClasses = exports.useUtilityClasses = void 0;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
function getFunnelSectionUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiFunnelSection', slot);
}
var useUtilityClasses = function (props) {
    var classes = props.classes, seriesId = props.seriesId, variant = props.variant, dataIndex = props.dataIndex;
    var slots = {
        root: ['root', "series-".concat(seriesId), "data-index-".concat(dataIndex)],
        highlighted: ['highlighted'],
        faded: ['faded'],
        outlined: variant === 'outlined' ? ['outlined'] : [],
        filled: variant === 'filled' ? ['filled'] : [],
        label: ['label'],
    };
    return (0, composeClasses_1.default)(slots, getFunnelSectionUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
var useLabelUtilityClasses = function (props) {
    var classes = props.classes, seriesId = props.seriesId, dataIndex = props.dataIndex;
    var slots = {
        label: ['label', "series-".concat(seriesId), "data-index-".concat(dataIndex)],
    };
    return (0, composeClasses_1.default)(slots, getFunnelSectionUtilityClass, classes);
};
exports.useLabelUtilityClasses = useLabelUtilityClasses;
exports.funnelSectionClasses = (0, generateUtilityClasses_1.default)('MuiFunnelSection', ['root', 'highlighted', 'faded', 'filled', 'outlined', 'label', 'series', 'data-index']);
