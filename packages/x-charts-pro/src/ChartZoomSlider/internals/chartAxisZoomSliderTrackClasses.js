"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.chartAxisZoomSliderTrackClasses = void 0;
exports.getAxisZoomSliderTrackUtilityClass = getAxisZoomSliderTrackUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var ClassNameGenerator_1 = require("@mui/utils/ClassNameGenerator");
exports.chartAxisZoomSliderTrackClasses = [
    'horizontal',
    'vertical',
    'background',
    'active',
].reduce(function (acc, slot) {
    acc[slot] = getAxisZoomSliderTrackUtilityClass(slot);
    return acc;
}, {});
function getAxisZoomSliderTrackUtilityClass(slot) {
    // We use the `ClassNameGenerator` because the original `generateUtilityClass` function
    // has a special case for the `active` slot.
    return "".concat(ClassNameGenerator_1.default.generate('MuiChartAxisZoomSliderTrack'), "-").concat(slot);
}
var useUtilityClasses = function (props) {
    var axisDirection = props.axisDirection;
    var slots = {
        background: [axisDirection === 'x' ? 'horizontal' : 'vertical', 'background'],
        active: [axisDirection === 'x' ? 'horizontal' : 'vertical', 'active'],
    };
    return (0, composeClasses_1.default)(slots, getAxisZoomSliderTrackUtilityClass);
};
exports.useUtilityClasses = useUtilityClasses;
