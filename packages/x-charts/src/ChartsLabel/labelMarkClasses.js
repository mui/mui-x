"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.labelMarkClasses = void 0;
exports.getLabelMarkUtilityClass = getLabelMarkUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getLabelMarkUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartsLabelMark', slot);
}
exports.labelMarkClasses = (0, generateUtilityClasses_1.default)('MuiChartsLabelMark', ['root', 'line', 'square', 'circle', 'fill']);
var useUtilityClasses = function (props) {
    var type = props.type;
    var slots = {
        root: typeof type === 'function' ? ['root'] : ['root', type],
        fill: ['fill'],
    };
    return (0, composeClasses_1.default)(slots, getLabelMarkUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;
