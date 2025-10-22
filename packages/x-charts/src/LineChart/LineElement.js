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
exports.lineElementClasses = void 0;
exports.getLineElementUtilityClass = getLineElementUtilityClass;
exports.LineElement = LineElement;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
var AnimatedLine_1 = require("./AnimatedLine");
var useItemHighlighted_1 = require("../hooks/useItemHighlighted");
function getLineElementUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiLineElement', slot);
}
exports.lineElementClasses = (0, generateUtilityClasses_1.default)('MuiLineElement', [
    'root',
    'highlighted',
    'faded',
    'series',
]);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, id = ownerState.id, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted;
    var slots = {
        root: ['root', "series-".concat(id), isHighlighted && 'highlighted', isFaded && 'faded'],
    };
    return (0, composeClasses_1.default)(slots, getLineElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineElement API](https://mui.com/x/api/charts/line-element/)
 */
function LineElement(props) {
    var _a;
    var id = props.id, innerClasses = props.classes, color = props.color, gradientId = props.gradientId, slots = props.slots, slotProps = props.slotProps, onClick = props.onClick, other = __rest(props, ["id", "classes", "color", "gradientId", "slots", "slotProps", "onClick"]);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'line', seriesId: id });
    var _b = (0, useItemHighlighted_1.useItemHighlighted)({
        seriesId: id,
    }), isFaded = _b.isFaded, isHighlighted = _b.isHighlighted;
    var ownerState = {
        id: id,
        classes: innerClasses,
        color: color,
        gradientId: gradientId,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
    };
    var classes = useUtilityClasses(ownerState);
    var Line = (_a = slots === null || slots === void 0 ? void 0 : slots.line) !== null && _a !== void 0 ? _a : AnimatedLine_1.AnimatedLine;
    var lineProps = (0, useSlotProps_1.default)({
        elementType: Line,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.line,
        additionalProps: __assign(__assign({}, interactionProps), { onClick: onClick, cursor: onClick ? 'pointer' : 'unset' }),
        className: classes.root,
        ownerState: ownerState,
    });
    return <Line {...other} {...lineProps}/>;
}
LineElement.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    color: prop_types_1.default.string.isRequired,
    d: prop_types_1.default.string.isRequired,
    gradientId: prop_types_1.default.string,
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
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
