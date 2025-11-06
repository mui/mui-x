"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTotalPrice = renderTotalPrice;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var Value = (0, styles_1.styled)('div')(function (_a) {
    var theme = _a.theme;
    return ({
        width: '100%',
        height: '100%',
        lineHeight: '100%',
        paddingRight: 8,
        fontVariantNumeric: 'tabular-nums',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '&.good': {
            color: theme.vars
                ? "rgb(".concat(theme.vars.palette.success.mainChannel, ")")
                : theme.palette.success.main,
        },
        '&.bad': {
            color: theme.vars ? "rgb(".concat(theme.vars.palette.error.mainChannel, ")") : theme.palette.error.main,
        },
        '&.filled.good': {
            color: 'inherit',
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.success.mainChannel, " /  0.3)")
                : (0, styles_1.alpha)(theme.palette.success.main, 0.3),
        },
        '&.filled.bad': {
            color: 'inherit',
            backgroundColor: theme.vars
                ? "rgba(".concat(theme.vars.palette.error.mainChannel, " /  0.3)")
                : (0, styles_1.alpha)(theme.palette.error.main, 0.3),
        },
    });
});
var currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
var TotalPrice = React.memo(function TotalPrice(props) {
    var value = props.value, grouped = props.grouped;
    return ((0, jsx_runtime_1.jsx)(Value, { className: (0, clsx_1.default)({
            good: value > 1000000,
            bad: value < 1000000,
            filled: !grouped,
        }), children: currencyFormatter.format(value) }));
});
function renderTotalPrice(params) {
    if (params.value == null) {
        return '';
    }
    // If the aggregated value does not have the same unit as the other cell
    // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
    if (params.aggregation && !params.aggregation.hasCellUnit) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(TotalPrice, { value: params.value, grouped: params.rowNode.type === 'group' });
}
