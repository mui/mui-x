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
exports.PieArcLabelPlot = PieArcLabelPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useTransformData_1 = require("./dataTransform/useTransformData");
var PieArcLabel_1 = require("./PieArcLabel");
var getLabel_1 = require("../internals/getLabel");
var RATIO = 180 / Math.PI;
function getItemLabel(arcLabel, arcLabelMinAngle, item) {
    var _a;
    if (!arcLabel) {
        return null;
    }
    var angle = (item.endAngle - item.startAngle) * RATIO;
    if (angle < arcLabelMinAngle) {
        return null;
    }
    switch (arcLabel) {
        case 'label':
            return (0, getLabel_1.getLabel)(item.label, 'arc');
        case 'value':
            return (_a = item.value) === null || _a === void 0 ? void 0 : _a.toString();
        case 'formattedValue':
            return item.formattedValue;
        default:
            return arcLabel(__assign(__assign({}, item), { label: (0, getLabel_1.getLabel)(item.label, 'arc') }));
    }
}
function PieArcLabelPlot(props) {
    var _a;
    var arcLabel = props.arcLabel, _b = props.arcLabelMinAngle, arcLabelMinAngle = _b === void 0 ? 0 : _b, arcLabelRadius = props.arcLabelRadius, _c = props.cornerRadius, cornerRadius = _c === void 0 ? 0 : _c, data = props.data, _d = props.faded, faded = _d === void 0 ? { additionalRadius: -5 } : _d, highlighted = props.highlighted, seriesId = props.seriesId, innerRadius = props.innerRadius, outerRadius = props.outerRadius, _e = props.paddingAngle, paddingAngle = _e === void 0 ? 0 : _e, skipAnimation = props.skipAnimation, slotProps = props.slotProps, slots = props.slots, other = __rest(props, ["arcLabel", "arcLabelMinAngle", "arcLabelRadius", "cornerRadius", "data", "faded", "highlighted", "seriesId", "innerRadius", "outerRadius", "paddingAngle", "skipAnimation", "slotProps", "slots"]);
    var transformedData = (0, useTransformData_1.useTransformData)({
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        arcLabelRadius: arcLabelRadius,
        cornerRadius: cornerRadius,
        paddingAngle: paddingAngle,
        id: seriesId,
        highlighted: highlighted,
        faded: faded,
        data: data,
    });
    if (data.length === 0) {
        return null;
    }
    var ArcLabel = (_a = slots === null || slots === void 0 ? void 0 : slots.pieArcLabel) !== null && _a !== void 0 ? _a : PieArcLabel_1.PieArcLabel;
    return ((0, jsx_runtime_1.jsx)("g", __assign({}, other, { children: transformedData.map(function (item) {
            var _a;
            return ((0, jsx_runtime_1.jsx)(ArcLabel, __assign({ startAngle: item.startAngle, endAngle: item.endAngle, paddingAngle: item.paddingAngle, innerRadius: item.innerRadius, outerRadius: item.outerRadius, arcLabelRadius: item.arcLabelRadius, cornerRadius: item.cornerRadius, hidden: item.hidden, seriesId: seriesId, color: item.color, isFaded: item.isFaded, isHighlighted: item.isHighlighted, formattedArcLabel: getItemLabel(arcLabel, arcLabelMinAngle, item), skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.pieArcLabel), (_a = item.id) !== null && _a !== void 0 ? _a : item.dataIndex));
        }) })));
}
PieArcLabelPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * The label displayed into the arc.
     */
    arcLabel: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf(['formattedValue', 'label', 'value']),
        prop_types_1.default.func,
    ]),
    /**
     * The minimal angle required to display the arc label.
     * @default 0
     */
    arcLabelMinAngle: prop_types_1.default.number,
    /**
     * The radius between circle center and the arc label in px.
     * @default (innerRadius - outerRadius) / 2
     */
    arcLabelRadius: prop_types_1.default.number,
    /**
     * The radius applied to arc corners (similar to border radius).
     * @default 0
     */
    cornerRadius: prop_types_1.default.number,
    data: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        color: prop_types_1.default.string.isRequired,
        endAngle: prop_types_1.default.number.isRequired,
        formattedValue: prop_types_1.default.string.isRequired,
        id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
        index: prop_types_1.default.number.isRequired,
        label: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
        labelMarkType: prop_types_1.default.oneOfType([
            prop_types_1.default.oneOf(['circle', 'line', 'square']),
            prop_types_1.default.func,
        ]),
        padAngle: prop_types_1.default.number.isRequired,
        startAngle: prop_types_1.default.number.isRequired,
        value: prop_types_1.default.number.isRequired,
    })).isRequired,
    /**
     * Override the arc attributes when it is faded.
     * @default { additionalRadius: -5 }
     */
    faded: prop_types_1.default.shape({
        additionalRadius: prop_types_1.default.number,
        arcLabelRadius: prop_types_1.default.number,
        color: prop_types_1.default.string,
        cornerRadius: prop_types_1.default.number,
        innerRadius: prop_types_1.default.number,
        outerRadius: prop_types_1.default.number,
        paddingAngle: prop_types_1.default.number,
    }),
    /**
     * Override the arc attributes when it is highlighted.
     */
    highlighted: prop_types_1.default.shape({
        additionalRadius: prop_types_1.default.number,
        arcLabelRadius: prop_types_1.default.number,
        color: prop_types_1.default.string,
        cornerRadius: prop_types_1.default.number,
        innerRadius: prop_types_1.default.number,
        outerRadius: prop_types_1.default.number,
        paddingAngle: prop_types_1.default.number,
    }),
    /**
     * The id of this series.
     */
    seriesId: prop_types_1.default.string.isRequired,
    /**
     * The radius between circle center and the beginning of the arc.
     * @default 0
     */
    innerRadius: prop_types_1.default.number,
    /**
     * The radius between circle center and the end of the arc.
     */
    outerRadius: prop_types_1.default.number.isRequired,
    /**
     * The padding angle (deg) between two arcs.
     * @default 0
     */
    paddingAngle: prop_types_1.default.number,
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
