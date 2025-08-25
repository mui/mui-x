"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsToolbarDivider = void 0;
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
    return (<Divider as={slots.baseDivider} orientation="vertical" {...slotProps.baseDivider} {...props} ref={ref}/>);
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
