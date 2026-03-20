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
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var internals_1 = require("@mui/x-charts/internals");
var heatmapClasses_1 = require("./heatmapClasses");
var HeatmapCell_1 = require("./HeatmapCell");
var shouldRegisterPointerInteractionsGlobally_1 = require("./shouldRegisterPointerInteractionsGlobally");
/**
 * @ignore - internal component.
 */
function HeatmapItem(props) {
    var _a;
    var seriesId = props.seriesId, color = props.color, value = props.value, _b = props.isHighlighted, isHighlighted = _b === void 0 ? false : _b, _c = props.isFaded, isFaded = _c === void 0 ? false : _c, borderRadius = props.borderRadius, xIndex = props.xIndex, yIndex = props.yIndex, _d = props.slotProps, slotProps = _d === void 0 ? {} : _d, _e = props.slots, slots = _e === void 0 ? {} : _e, other = __rest(props, ["seriesId", "color", "value", "isHighlighted", "isFaded", "borderRadius", "xIndex", "yIndex", "slotProps", "slots"]);
    // If we aren't using the default cell, we skip adding interaction props because we have a more efficient way to
    // calculate them. To avoid breaking changes, we need to keep this behavior. We can remove this in v9.
    var skipInteractionItemProps = (0, shouldRegisterPointerInteractionsGlobally_1.shouldRegisterPointerInteractionsGlobally)(props.slots, props.slotProps);
    var interactionProps = (0, internals_1.useInteractionItemProps)({ type: 'heatmap', seriesId: seriesId, xIndex: xIndex, yIndex: yIndex }, skipInteractionItemProps);
    var ownerState = {
        seriesId: seriesId,
        color: color,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
        value: value,
    };
    var classes = (0, heatmapClasses_1.useUtilityClasses)(ownerState);
    var Cell = (_a = slots === null || slots === void 0 ? void 0 : slots.cell) !== null && _a !== void 0 ? _a : HeatmapCell_1.HeatmapCell;
    var cellProps = (0, useSlotProps_1.default)({
        elementType: Cell,
        additionalProps: __assign(__assign({}, interactionProps), { rx: borderRadius, ry: borderRadius, 'data-highlighted': isHighlighted || undefined, 'data-faded': isFaded || undefined }),
        externalForwardedProps: __assign({}, other),
        externalSlotProps: slotProps.cell,
        ownerState: ownerState,
        className: classes.cell,
    });
    return (0, jsx_runtime_1.jsx)(Cell, __assign({}, cellProps));
}
HeatmapItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    color: prop_types_1.default.string.isRequired,
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
