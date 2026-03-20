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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeBarPlot = RangeBarPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var BarChart_1 = require("@mui/x-charts/BarChart");
var hooks_1 = require("@mui/x-charts/hooks");
var hooks_2 = require("@mui/x-charts-pro/hooks");
var useUtilityClasses_1 = require("./useUtilityClasses");
var useRangeBarPlotData_1 = require("./useRangeBarPlotData");
var AnimatedRangeBarElement_1 = require("./AnimatedRangeBarElement");
var RangeBarPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiRangeBarPlot',
    slot: 'Root',
})((_a = {},
    _a["& .".concat(BarChart_1.barClasses.element)] = {
        transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    },
    _a));
/**
 * Demos:
 *
 * - [Range Bar](https://mui.com/x/react-charts/range-bar/)
 *
 * API:
 *
 * - [RangeBarPlot API](https://mui.com/x/api/charts/range-bar-plot/)
 */
function RangeBarPlot(props) {
    var _a, _b;
    var inSkipAnimation = props.skipAnimation, onItemClick = props.onItemClick, borderRadius = props.borderRadius, other = __rest(props, ["skipAnimation", "onItemClick", "borderRadius"]);
    var isZoomInteracting = (0, hooks_2.useIsZoomInteracting)();
    var skipAnimation = (0, internals_1.useSkipAnimation)(isZoomInteracting || inSkipAnimation);
    var xAxes = (0, hooks_1.useXAxes)().xAxis;
    var yAxes = (0, hooks_1.useYAxes)().yAxis;
    var completedData = (0, useRangeBarPlotData_1.useRangeBarPlotData)((0, hooks_1.useDrawingArea)(), xAxes, yAxes);
    var classes = (0, useUtilityClasses_1.useUtilityClasses)();
    var slots = __assign(__assign({}, props.slots), { bar: (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.bar) !== null && _b !== void 0 ? _b : AnimatedRangeBarElement_1.AnimatedRangeBarElement });
    return ((0, jsx_runtime_1.jsx)(RangeBarPlotRoot, { className: classes.root, children: completedData.map(function (_a) {
            var seriesId = _a.seriesId, layout = _a.layout, xOrigin = _a.xOrigin, yOrigin = _a.yOrigin, data = _a.data;
            return ((0, jsx_runtime_1.jsx)("g", { "data-series": seriesId, className: classes.series, children: data.map(function (_a) {
                    var dataIndex = _a.dataIndex, color = _a.color, x = _a.x, y = _a.y, width = _a.width, height = _a.height, hidden = _a.hidden;
                    return ((0, jsx_runtime_1.jsx)(BarChart_1.BarElement, __assign({ seriesId: seriesId, dataIndex: dataIndex, color: color, skipAnimation: skipAnimation !== null && skipAnimation !== void 0 ? skipAnimation : false, layout: layout !== null && layout !== void 0 ? layout : 'vertical', x: x, xOrigin: xOrigin, y: y, yOrigin: yOrigin, width: width, height: height, hidden: hidden, rx: borderRadius, ry: borderRadius }, other, { slots: slots, onClick: onItemClick &&
                            (function (event) {
                                onItemClick(event, { type: 'rangeBar', seriesId: seriesId, dataIndex: dataIndex });
                            }) }), dataIndex));
                }) }, seriesId));
        }) }));
}
RangeBarPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Defines the border radius of the bar element.
     */
    borderRadius: prop_types_1.default.number,
    /**
     * Callback fired when a bar item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {RangeBarItemIdentifier} barItemIdentifier The range bar item identifier.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
     * @default undefined
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
