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
exports.PieArcLabel = exports.pieArcLabelClasses = void 0;
exports.getPieArcLabelUtilityClass = getPieArcLabelUtilityClass;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var styles_1 = require("@mui/material/styles");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var animation_1 = require("../internals/animation/animation");
var useAnimatePieArcLabel_1 = require("../hooks/animation/useAnimatePieArcLabel");
function getPieArcLabelUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiPieArcLabel', slot);
}
exports.pieArcLabelClasses = (0, generateUtilityClasses_1.default)('MuiPieArcLabel', [
    'root',
    'highlighted',
    'faded',
    'animate',
    'series',
]);
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, seriesId = ownerState.seriesId, isFaded = ownerState.isFaded, isHighlighted = ownerState.isHighlighted, skipAnimation = ownerState.skipAnimation;
    var slots = {
        root: [
            'root',
            "series-".concat(seriesId),
            isHighlighted && 'highlighted',
            isFaded && 'faded',
            !skipAnimation && 'animate',
        ],
    };
    return (0, composeClasses_1.default)(slots, getPieArcLabelUtilityClass, classes);
};
var PieArcLabelRoot = (0, styles_1.styled)('text', {
    name: 'MuiPieArcLabel',
    slot: 'Root',
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            fill: (theme.vars || theme).palette.text.primary,
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            pointerEvents: 'none',
            animationName: 'animate-opacity',
            animationDuration: '0s',
            animationTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION,
            transitionDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
            transitionProperty: 'opacity',
            transitionTimingFunction: animation_1.ANIMATION_TIMING_FUNCTION
        },
        _b["&.".concat(exports.pieArcLabelClasses.animate)] = {
            animationDuration: "".concat(animation_1.ANIMATION_DURATION_MS, "ms"),
        },
        _b['@keyframes animate-opacity'] = {
            from: { opacity: 0 },
        },
        _b);
});
var PieArcLabel = React.forwardRef(function PieArcLabel(props, ref) {
    var seriesId = props.seriesId, innerClasses = props.classes, color = props.color, startAngle = props.startAngle, endAngle = props.endAngle, paddingAngle = props.paddingAngle, arcLabelRadius = props.arcLabelRadius, innerRadius = props.innerRadius, outerRadius = props.outerRadius, cornerRadius = props.cornerRadius, formattedArcLabel = props.formattedArcLabel, isHighlighted = props.isHighlighted, isFaded = props.isFaded, skipAnimation = props.skipAnimation, hidden = props.hidden, other = __rest(props, ["seriesId", "classes", "color", "startAngle", "endAngle", "paddingAngle", "arcLabelRadius", "innerRadius", "outerRadius", "cornerRadius", "formattedArcLabel", "isHighlighted", "isFaded", "skipAnimation", "hidden"]);
    var ownerState = {
        seriesId: seriesId,
        classes: innerClasses,
        color: color,
        isFaded: isFaded,
        isHighlighted: isHighlighted,
        skipAnimation: skipAnimation,
    };
    var classes = useUtilityClasses(ownerState);
    var animatedProps = (0, useAnimatePieArcLabel_1.useAnimatePieArcLabel)({
        cornerRadius: cornerRadius,
        startAngle: startAngle,
        endAngle: endAngle,
        innerRadius: arcLabelRadius,
        outerRadius: arcLabelRadius,
        paddingAngle: paddingAngle,
        skipAnimation: skipAnimation,
        ref: ref,
    });
    return ((0, jsx_runtime_1.jsx)(PieArcLabelRoot, __assign({ className: classes.root }, other, animatedProps, { opacity: hidden ? 0 : 1, children: formattedArcLabel })));
});
exports.PieArcLabel = PieArcLabel;
PieArcLabel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    arcLabelRadius: prop_types_1.default.number.isRequired,
    classes: prop_types_1.default.object,
    color: prop_types_1.default.string.isRequired,
    cornerRadius: prop_types_1.default.number.isRequired,
    endAngle: prop_types_1.default.number.isRequired,
    formattedArcLabel: prop_types_1.default.string,
    hidden: prop_types_1.default.bool,
    innerRadius: prop_types_1.default.number.isRequired,
    isFaded: prop_types_1.default.bool.isRequired,
    isHighlighted: prop_types_1.default.bool.isRequired,
    outerRadius: prop_types_1.default.number.isRequired,
    paddingAngle: prop_types_1.default.number.isRequired,
    seriesId: prop_types_1.default.string.isRequired,
    skipAnimation: prop_types_1.default.bool.isRequired,
    startAngle: prop_types_1.default.number.isRequired,
};
