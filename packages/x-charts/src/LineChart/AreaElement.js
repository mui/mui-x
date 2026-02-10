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
exports.areaElementClasses = void 0;
exports.getAreaElementUtilityClass = getAreaElementUtilityClass;
exports.AreaElement = AreaElement;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var useItemHighlighted_1 = require("../hooks/useItemHighlighted");
var AnimatedArea_1 = require("./AnimatedArea");
function getAreaElementUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiAreaElement', slot);
}
exports.areaElementClasses = (0, generateUtilityClasses_1.default)('MuiAreaElement', [
    'root',
    'highlighted',
    'faded',
    'series',
]);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted;
    var slots = {
        root: ['root', "series-".concat(seriesId), isHighlighted && 'highlighted', isFaded && 'faded'],
    };
    return (0, composeClasses_1.default)(slots, getAreaElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/area-element/)
 */
function AreaElement(props) {
    var _a;
    var seriesId = props.seriesId, innerClasses = props.classes, color = props.color, gradientId = props.gradientId, slots = props.slots, slotProps = props.slotProps, onClick = props.onClick, other = __rest(props, ["seriesId", "classes", "color", "gradientId", "slots", "slotProps", "onClick"]);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'line', seriesId: seriesId });
    var _b = (0, useItemHighlighted_1.useItemHighlighted)({
        seriesId: seriesId,
    }), isFaded = _b.isFaded, isHighlighted = _b.isHighlighted;
    var ownerState = {
        seriesId: seriesId,
        classes: innerClasses,
        color: color,
        gradientId: gradientId,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
    };
    var classes = useUtilityClasses(ownerState);
    var Area = (_a = slots === null || slots === void 0 ? void 0 : slots.area) !== null && _a !== void 0 ? _a : AnimatedArea_1.AnimatedArea;
    var areaProps = (0, useSlotProps_1.default)({
        elementType: Area,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.area,
        additionalProps: __assign(__assign({}, interactionProps), { onClick: onClick, cursor: onClick ? 'pointer' : 'unset' }),
        className: classes.root,
        ownerState: ownerState,
    });
    return (0, jsx_runtime_1.jsx)(Area, __assign({}, other, areaProps));
}
AreaElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    color: prop_types_1.default.string.isRequired,
    d: prop_types_1.default.string.isRequired,
    gradientId: prop_types_1.default.string,
    seriesId: prop_types_1.default.string.isRequired,
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation: prop_types_1.default.bool,
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
};
