"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProps = exports.YAxisRoot = exports.AXIS_LABEL_TICK_LABEL_GAP = exports.TICK_LABEL_GAP = exports.useUtilityClasses = void 0;
var composeClasses_1 = require("@mui/utils/composeClasses");
var styles_1 = require("@mui/material/styles");
var axisClasses_1 = require("../ChartsAxis/axisClasses");
var AxisSharedComponents_1 = require("../internals/components/AxisSharedComponents");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, position = ownerState.position, id = ownerState.id;
    var slots = {
        root: ['root', 'directionY', position, "id-".concat(id)],
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
exports.TICK_LABEL_GAP = 2;
/* Gap between the axis label and tick labels. */
exports.AXIS_LABEL_TICK_LABEL_GAP = 2;
exports.YAxisRoot = (0, styles_1.styled)(AxisSharedComponents_1.AxisRoot, {
    name: 'MuiChartsYAxis',
    slot: 'Root',
})({});
exports.defaultProps = {
    disableLine: false,
    disableTicks: false,
    tickSize: 6,
};
