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
exports.PieArcPlot = PieArcPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var PieArc_1 = require("./PieArc");
var useTransformData_1 = require("./dataTransform/useTransformData");
function PieArcPlot(props) {
    var _a;
    var slots = props.slots, slotProps = props.slotProps, _b = props.innerRadius, innerRadius = _b === void 0 ? 0 : _b, outerRadius = props.outerRadius, _c = props.cornerRadius, cornerRadius = _c === void 0 ? 0 : _c, _d = props.paddingAngle, paddingAngle = _d === void 0 ? 0 : _d, seriesId = props.seriesId, highlighted = props.highlighted, _e = props.faded, faded = _e === void 0 ? { additionalRadius: -5 } : _e, data = props.data, onItemClick = props.onItemClick, skipAnimation = props.skipAnimation, other = __rest(props, ["slots", "slotProps", "innerRadius", "outerRadius", "cornerRadius", "paddingAngle", "seriesId", "highlighted", "faded", "data", "onItemClick", "skipAnimation"]);
    var transformedData = (0, useTransformData_1.useTransformData)({
        innerRadius: innerRadius,
        outerRadius: outerRadius,
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
    var Arc = (_a = slots === null || slots === void 0 ? void 0 : slots.pieArc) !== null && _a !== void 0 ? _a : PieArc_1.PieArc;
    return ((0, jsx_runtime_1.jsx)("g", __assign({}, other, { children: transformedData.map(function (item, index) { return ((0, jsx_runtime_1.jsx)(Arc, __assign({ startAngle: item.startAngle, endAngle: item.endAngle, paddingAngle: item.paddingAngle, innerRadius: item.innerRadius, outerRadius: item.outerRadius, cornerRadius: item.cornerRadius, skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false, seriesId: seriesId, color: item.color, dataIndex: index, isFaded: item.isFaded, isHighlighted: item.isHighlighted, isFocused: item.isFocused, onClick: onItemClick &&
                (function (event) {
                    onItemClick(event, { type: 'pie', seriesId: seriesId, dataIndex: index }, item);
                }) }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.pieArc), item.dataIndex)); }) })));
}
PieArcPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
     * Callback fired when a pie item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
     * @param {DefaultizedPieValueType} item The pie item.
     */
    onItemClick: prop_types_1.default.func,
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
