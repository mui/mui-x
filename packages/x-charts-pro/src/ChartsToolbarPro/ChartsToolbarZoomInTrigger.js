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
exports.ChartsToolbarZoomInTrigger = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var internals_1 = require("@mui/x-charts/internals");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useChartProZoom_1 = require("../internals/plugins/useChartProZoom");
/**
 * A button that zooms the chart in.
 * It renders the `baseButton` slot.
 */
var ChartsToolbarZoomInTrigger = React.forwardRef(function ChartsToolbarZoomInTrigger(_a, ref) {
    var render = _a.render, other = __rest(_a, ["render"]);
    var _b = (0, internals_1.useChartsSlots)(), slots = _b.slots, slotProps = _b.slotProps;
    var _c = (0, internals_1.useChartContext)(), instance = _c.instance, store = _c.store;
    var disabled = (0, internals_1.useSelector)(store, useChartProZoom_1.selectorChartCanZoomIn);
    var element = (0, useComponentRenderer_1.useComponentRenderer)(slots.baseButton, render, __assign(__assign(__assign(__assign({}, slotProps.baseButton), { onClick: function () { return instance.zoomIn(); }, disabled: disabled }), other), { ref: ref }));
    return <React.Fragment>{element}</React.Fragment>;
});
exports.ChartsToolbarZoomInTrigger = ChartsToolbarZoomInTrigger;
ChartsToolbarZoomInTrigger.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * A function to customize the rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
};
