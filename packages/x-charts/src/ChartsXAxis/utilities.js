"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProps = exports.AXIS_LABEL_TICK_LABEL_GAP = exports.TICK_LABEL_GAP = exports.useUtilityClasses = void 0;
var composeClasses_1 = require("@mui/utils/composeClasses");
var axisClasses_1 = require("../ChartsAxis/axisClasses");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, position = ownerState.position;
    var slots = {
        root: ['root', 'directionX', position],
        line: ['line'],
        tickContainer: ['tickContainer'],
        tick: ['tick'],
        tickLabel: ['tickLabel'],
        label: ['label'],
    };
    return (0, composeClasses_1.default)(slots, axisClasses_1.getAxisUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
/* Gap between a tick and its label. */
exports.TICK_LABEL_GAP = 3;
/* Gap between the axis label and tick labels. */
exports.AXIS_LABEL_TICK_LABEL_GAP = 4;
exports.defaultProps = {
    disableLine: false,
    disableTicks: false,
    tickSize: 6,
    tickLabelMinGap: 4,
};
