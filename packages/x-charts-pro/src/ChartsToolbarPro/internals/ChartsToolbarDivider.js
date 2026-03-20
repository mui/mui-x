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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsToolbarDivider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-charts/internals");
// This is workaround because api-docs-builder does not support the `NotRendered<ChartBaseDividerProps>` syntax.
var NotRenderedDivider = internals_1.NotRendered;
var Divider = (0, system_1.styled)(NotRenderedDivider, {
    name: 'MuiChartsToolbar',
    slot: 'Divider',
})(function (_a) {
    var theme = _a.theme;
    return ({
        margin: theme.spacing(0, 0.5),
        height: '50%',
    });
});
var ChartsToolbarDivider = React.forwardRef(function ChartsToolbarDivider(props, ref) {
    var _a = (0, internals_1.useChartsSlots)(), slots = _a.slots, slotProps = _a.slotProps;
    return ((0, jsx_runtime_1.jsx)(Divider, __assign({ as: slots.baseDivider, orientation: "vertical" }, slotProps.baseDivider, props, { ref: ref })));
});
exports.ChartsToolbarDivider = ChartsToolbarDivider;
ChartsToolbarDivider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    orientation: prop_types_1.default.oneOf(['horizontal', 'vertical']),
    style: prop_types_1.default.object,
};
