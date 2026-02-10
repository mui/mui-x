"use strict";
'use client';
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
exports.BarElement = BarElement;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var barElementClasses_1 = require("./barElementClasses");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var useItemHighlighted_1 = require("../hooks/useItemHighlighted");
var AnimatedBarElement_1 = require("./AnimatedBarElement");
var useIsItemFocused_1 = require("../hooks/useIsItemFocused");
function BarElement(props) {
    var _a;
    var seriesId = props.seriesId, dataIndex = props.dataIndex, innerClasses = props.classes, color = props.color, slots = props.slots, slotProps = props.slotProps, style = props.style, onClick = props.onClick, skipAnimation = props.skipAnimation, layout = props.layout, x = props.x, xOrigin = props.xOrigin, y = props.y, yOrigin = props.yOrigin, width = props.width, height = props.height, hidden = props.hidden, other = __rest(props, ["seriesId", "dataIndex", "classes", "color", "slots", "slotProps", "style", "onClick", "skipAnimation", "layout", "x", "xOrigin", "y", "yOrigin", "width", "height", "hidden"]);
    var itemIdentifier = React.useMemo(function () { return ({ type: 'bar', seriesId: seriesId, dataIndex: dataIndex }); }, [seriesId, dataIndex]);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)(itemIdentifier);
    var _b = (0, useItemHighlighted_1.useItemHighlighted)(itemIdentifier), isFaded = _b.isFaded, isHighlighted = _b.isHighlighted;
    var isFocused = (0, useIsItemFocused_1.useIsItemFocused)(React.useMemo(function () { return ({
        type: 'bar',
        seriesId: seriesId,
        dataIndex: dataIndex,
    }); }, [seriesId, dataIndex]));
    var ownerState = {
        seriesId: seriesId,
        dataIndex: dataIndex,
        classes: innerClasses,
        color: color,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
        isFocused: isFocused,
    };
    var classes = (0, barElementClasses_1.useUtilityClasses)(ownerState);
    var Bar = (_a = slots === null || slots === void 0 ? void 0 : slots.bar) !== null && _a !== void 0 ? _a : AnimatedBarElement_1.AnimatedBarElement;
    var barProps = (0, useSlotProps_1.default)({
        elementType: Bar,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.bar,
        externalForwardedProps: other,
        additionalProps: __assign(__assign({}, interactionProps), { seriesId: seriesId, dataIndex: dataIndex, color: color, x: x, xOrigin: xOrigin, y: y, yOrigin: yOrigin, width: width, height: height, style: style, onClick: onClick, cursor: onClick ? 'pointer' : 'unset', stroke: 'none', fill: color, skipAnimation: skipAnimation, layout: layout, hidden: hidden }),
        className: classes.root,
        ownerState: ownerState,
    });
    return (0, jsx_runtime_1.jsx)(Bar, __assign({}, barProps));
}
BarElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    dataIndex: prop_types_1.default.number.isRequired,
    layout: prop_types_1.default.oneOf(['horizontal', 'vertical']).isRequired,
    seriesId: prop_types_1.default.string.isRequired,
    skipAnimation: prop_types_1.default.bool.isRequired,
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
    xOrigin: prop_types_1.default.number.isRequired,
    yOrigin: prop_types_1.default.number.isRequired,
};
