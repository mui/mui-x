"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.chartAxisZoomSliderThumbClasses = void 0;
exports.getAxisZoomSliderThumbUtilityClass = getAxisZoomSliderThumbUtilityClass;
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
exports.chartAxisZoomSliderThumbClasses = (0, generateUtilityClasses_1.default)('MuiChartAxisZoomSliderThumb', [
    'root',
    'horizontal',
    'vertical',
    'start',
    'end',
]);
function getAxisZoomSliderThumbUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiChartAxisZoomSliderThumb', slot);
}
var useUtilityClasses = function (ownerState) {
    var orientation = ownerState.orientation, placement = ownerState.placement;
    var slots = {
        root: [
            'root',
            orientation === 'horizontal' ? 'horizontal' : 'vertical',
            placement === 'start' ? 'start' : 'end',
        ],
    };
    return (0, composeClasses_1.default)(slots, getAxisZoomSliderThumbUtilityClass);
};
exports.useUtilityClasses = useUtilityClasses;
