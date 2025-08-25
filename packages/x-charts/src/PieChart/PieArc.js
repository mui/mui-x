"use strict";
'use client';
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
exports.PieArc = exports.pieArcClasses = void 0;
exports.getPieArcUtilityClass = getPieArcUtilityClass;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var styles_1 = require("@mui/material/styles");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var hooks_1 = require("../hooks");
var animation_1 = require("../internals/animation/animation");
var useInteractionItemProps_1 = require("../hooks/useInteractionItemProps");
function getPieArcUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPieArc', slot);
}
exports.pieArcClasses = (0, generateUtilityClasses_1.default)('MuiPieArc', [
    'root',
    'highlighted',
    'faded',
    'series',
]);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, id = ownerState.id, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted, dataIndex = ownerState.dataIndex;
    var slots = {
        root: [
            'root',
            "series-".concat(id),
            "data-index-".concat(dataIndex),
            isHighlighted && 'highlighted',
            isFaded && 'faded',
        ],
    };
    return (0, composeClasses_1.default)(slots, getPieArcUtilityClass, classes);
};
var PieArcRoot = (0, styles_1.styled)('path', {
    name: 'MuiPieArc',
    slot: 'Root',
    overridesResolver: function (_, styles) { return styles.arc; }, // FIXME: Inconsistent naming with slot
})(function (_a) {
    var theme = _a.theme;
    return ({
        // Got to move stroke to an element prop instead of style.
        stroke: (theme.vars || theme).palette.background.paper,
        transitionProperty: 'opacity, fill, filter',
        transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
    });
});
var PieArc = React.forwardRef(function PieArc(props, ref) {
    var innerClasses = props.classes, color = props.color, dataIndex = props.dataIndex, id = props.id, isFaded = props.isFaded, isHighlighted = props.isHighlighted, onClick = props.onClick, cornerRadius = props.cornerRadius, startAngle = props.startAngle, endAngle = props.endAngle, innerRadius = props.innerRadius, outerRadius = props.outerRadius, paddingAngle = props.paddingAngle, skipAnimation = props.skipAnimation, other = __rest(props, ["classes", "color", "dataIndex", "id", "isFaded", "isHighlighted", "onClick", "cornerRadius", "startAngle", "endAngle", "innerRadius", "outerRadius", "paddingAngle", "skipAnimation"]);
    var ownerState = {
        id: id,
        dataIndex: dataIndex,
        classes: innerClasses,
        color: color,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
    };
    var classes = useUtilityClasses(ownerState);
    var interactionProps = (0, useInteractionItemProps_1.useInteractionItemProps)({ type: 'pie', seriesId: id, dataIndex: dataIndex });
    var animatedProps = (0, hooks_1.useAnimatePieArc)({
        cornerRadius: cornerRadius,
        startAngle: startAngle,
        endAngle: endAngle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        paddingAngle: paddingAngle,
        skipAnimation: skipAnimation,
        ref: ref,
    });
    return (<PieArcRoot onClick={onClick} cursor={onClick ? 'pointer' : 'unset'} ownerState={ownerState} className={classes.root} fill={ownerState.color} opacity={ownerState.isFaded ? 0.3 : 1} filter={ownerState.isHighlighted ? 'brightness(120%)' : 'none'} strokeWidth={1} strokeLinejoin="round" data-highlighted={ownerState.isHighlighted || undefined} data-faded={ownerState.isFaded || undefined} {...other} {...interactionProps} {...animatedProps}/>);
});
exports.PieArc = PieArc;
PieArc.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    classes: prop_types_1.default.object,
    cornerRadius: prop_types_1.default.number.isRequired,
    dataIndex: prop_types_1.default.number.isRequired,
    endAngle: prop_types_1.default.number.isRequired,
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    innerRadius: prop_types_1.default.number.isRequired,
    isFaded: prop_types_1.default.bool.isRequired,
    isHighlighted: prop_types_1.default.bool.isRequired,
    outerRadius: prop_types_1.default.number.isRequired,
    paddingAngle: prop_types_1.default.number.isRequired,
    /**
     * @default false
     */
    skipAnimation: prop_types_1.default.bool.isRequired,
    startAngle: prop_types_1.default.number.isRequired,
};
