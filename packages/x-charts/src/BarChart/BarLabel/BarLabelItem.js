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
exports.BarLabelItem = BarLabelItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var prop_types_1 = require("prop-types");
var barLabelClasses_1 = require("./barLabelClasses");
var getBarLabel_1 = require("./getBarLabel");
var BarLabel_1 = require("./BarLabel");
var useItemHighlighted_1 = require("../../hooks/useItemHighlighted");
/**
 * @ignore - internal component.
 */
function BarLabelItem(props) {
    var _a;
    var seriesId = props.seriesId, innerClasses = props.classes, color = props.color, dataIndex = props.dataIndex, barLabel = props.barLabel, slots = props.slots, slotProps = props.slotProps, xOrigin = props.xOrigin, yOrigin = props.yOrigin, x = props.x, y = props.y, width = props.width, height = props.height, value = props.value, skipAnimation = props.skipAnimation, layout = props.layout, barLabelPlacement = props.barLabelPlacement, hidden = props.hidden, other = __rest(props, ["seriesId", "classes", "color", "dataIndex", "barLabel", "slots", "slotProps", "xOrigin", "yOrigin", "x", "y", "width", "height", "value", "skipAnimation", "layout", "barLabelPlacement", "hidden"]);
    var _b = (0, useItemHighlighted_1.useItemHighlighted)({
        seriesId: seriesId,
        dataIndex: dataIndex,
    }), isFaded = _b.isFaded, isHighlighted = _b.isHighlighted;
    var ownerState = {
        seriesId: seriesId,
        classes: innerClasses,
        color: color,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
        dataIndex: dataIndex,
        skipAnimation: skipAnimation,
        layout: layout,
    };
    var classes = (0, barLabelClasses_1.useUtilityClasses)(ownerState);
    var Component = (_a = slots === null || slots === void 0 ? void 0 : slots.barLabel) !== null && _a !== void 0 ? _a : BarLabel_1.BarLabel;
    var _c = (0, useSlotProps_1.default)({
        elementType: Component,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.barLabel,
        additionalProps: __assign(__assign({}, other), { xOrigin: xOrigin, yOrigin: yOrigin, x: x, y: y, width: width, height: height, placement: barLabelPlacement, className: classes.root }),
        ownerState: ownerState,
    }), barLabelOwnerState = _c.ownerState, barLabelProps = __rest(_c, ["ownerState"]);
    if (!barLabel) {
        return null;
    }
    var formattedLabelText = (0, getBarLabel_1.getBarLabel)({
        barLabel: barLabel,
        value: value,
        dataIndex: dataIndex,
        seriesId: seriesId,
        height: height,
        width: width,
    });
    if (!formattedLabelText) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(Component, __assign({}, barLabelProps, barLabelOwnerState, { hidden: hidden, children: formattedLabelText })));
}
BarLabelItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * If provided, the function will be used to format the label of the bar.
     * It can be set to 'value' to display the current value.
     * @param {BarItem} item The item to format.
     * @param {BarLabelContext} context data about the bar.
     * @returns {string} The formatted label.
     */
    barLabel: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['value']), prop_types_1.default.func]),
    classes: prop_types_1.default.object,
    color: prop_types_1.default.string.isRequired,
    dataIndex: prop_types_1.default.number.isRequired,
    /**
     * The height of the bar.
     */
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
    /**
     * The value of the data point.
     */
    value: prop_types_1.default.number,
    /**
     * The width of the bar.
     */
    width: prop_types_1.default.number.isRequired,
};
