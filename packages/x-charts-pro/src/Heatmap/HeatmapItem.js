"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapItem = HeatmapItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var composeClasses_1 = require("@mui/utils/composeClasses");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var heatmapClasses_1 = require("./heatmapClasses");
var HeatmapCell = (0, styles_1.styled)('rect', {
    name: 'MuiHeatmap',
    slot: 'Cell',
    overridesResolver: function (_, styles) { return styles.arc; }, // FIXME: Inconsistent naming with slot
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        filter: (ownerState.isHighlighted && 'saturate(120%)') ||
            (ownerState.isFaded && 'saturate(80%)') ||
            undefined,
        fill: ownerState.color,
        shapeRendering: 'crispEdges',
    });
});
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted;
    var slots = {
        cell: ['cell', "series-".concat(seriesId), isFaded && 'faded', isHighlighted && 'highlighted'],
    };
    return (0, composeClasses_1.default)(slots, heatmapClasses_1.getHeatmapUtilityClass, classes);
};
/**
 * @ignore - internal component.
 */
function HeatmapItem(props) {
    var _a;
    var seriesId = props.seriesId, dataIndex = props.dataIndex, color = props.color, value = props.value, _b = props.slotProps, slotProps = _b === void 0 ? {} : _b, _c = props.slots, slots = _c === void 0 ? {} : _c, other = __rest(props, ["seriesId", "dataIndex", "color", "value", "slotProps", "slots"]);
    var interactionProps = (0, internals_1.useInteractionItemProps)({ type: 'heatmap', seriesId: seriesId, dataIndex: dataIndex });
    var _d = (0, hooks_1.useItemHighlighted)({
        seriesId: seriesId,
        dataIndex: dataIndex,
    }), isFaded = _d.isFaded, isHighlighted = _d.isHighlighted;
    var ownerState = {
        seriesId: seriesId,
        dataIndex: dataIndex,
        color: color,
        value: value,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
    };
    var classes = useUtilityClasses(ownerState);
    var Cell = (_a = slots === null || slots === void 0 ? void 0 : slots.cell) !== null && _a !== void 0 ? _a : HeatmapCell;
    var cellProps = (0, useSlotProps_1.default)({
        elementType: Cell,
        additionalProps: interactionProps,
        externalForwardedProps: __assign({}, other),
        externalSlotProps: slotProps.cell,
        ownerState: ownerState,
        className: classes.cell,
    });
    return <Cell {...cellProps}/>;
}
HeatmapItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    color: prop_types_1.default.string.isRequired,
    dataIndex: prop_types_1.default.number.isRequired,
    height: prop_types_1.default.number.isRequired,
    seriesId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    value: prop_types_1.default.number.isRequired,
    width: prop_types_1.default.number.isRequired,
    x: prop_types_1.default.number.isRequired,
    y: prop_types_1.default.number.isRequired,
};
