"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OHLCTooltipContent = OHLCTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
function OHLCTooltipContent(props) {
    var item = props.item;
    var classes = (0, internals_1.useChartsTooltipUtilityClasses)(props.classes);
    var localeText = (0, hooks_1.useChartsLocalization)().localeText;
    /* This can only happen if the series is a radar series, but this is a candlestick tooltip,
     * so in practice this will never happen.
     * We can remove this if/when we fix the multiples values in an item tooltip
     * introduced with the radar chart. */
    if ('values' in item) {
        return null;
    }
    if (item.value == null) {
        return null;
    }
    var _a = item.value, open = _a[0], high = _a[1], low = _a[2], close = _a[3];
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: localeText.open }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: open })] }), (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: localeText.high }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: high })] }), (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: localeText.low }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: low })] }), (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: localeText.close }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: close })] })] }));
}
