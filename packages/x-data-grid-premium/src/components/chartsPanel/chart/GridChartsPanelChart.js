"use strict";
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
exports.GridChartsPanelChart = GridChartsPanelChart;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['chartsManagement'],
        chartTypeRoot: ['chartTypeRoot'],
        button: ['chartTypeSelectorButton'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var GridChartsManagementRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsManagement',
})({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
});
var GridChartTypeRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartTypeRoot',
})({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: internals_1.vars.spacing(1),
    padding: internals_1.vars.spacing(1),
});
var GridChartTypeButton = (0, system_1.styled)('button', {
    name: 'MuiDataGrid',
    slot: 'ChartTypeSelectorButton',
    shouldForwardProp: function (prop) { return prop !== 'isSelected'; },
})(function (_a) {
    var isSelected = _a.isSelected;
    return {
        backgroundColor: isSelected
            ? "color-mix(in srgb, ".concat(internals_1.vars.colors.interactive.selected, " calc(").concat(internals_1.vars.colors.interactive.selectedOpacity, " * 100%), ").concat(internals_1.vars.colors.background.base, ")")
            : internals_1.vars.colors.background.base,
        color: isSelected ? internals_1.vars.colors.interactive.selected : internals_1.vars.colors.foreground.muted,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: internals_1.vars.spacing(0.5),
        padding: internals_1.vars.spacing(1.5, 1, 1),
        border: "1px solid ".concat(isSelected ? internals_1.vars.colors.interactive.selected : internals_1.vars.colors.border.base),
        font: internals_1.vars.typography.font.small,
        fontWeight: internals_1.vars.typography.fontWeight.medium,
        borderRadius: internals_1.vars.radius.base,
        transition: internals_1.vars.transition(['border-color', 'background-color', 'color'], {
            duration: internals_1.vars.transitions.duration.short,
            easing: internals_1.vars.transitions.easing.easeInOut,
        }),
        '&:hover': {
            backgroundColor: isSelected
                ? "color-mix(in srgb, ".concat(internals_1.vars.colors.interactive.selected, " calc(").concat(internals_1.vars.colors.interactive.selectedOpacity, " * 100%), ").concat(internals_1.vars.colors.background.base, ")")
                : internals_1.vars.colors.interactive.hover,
        },
    };
});
function GridChartsPanelChart(props) {
    var schema = props.schema, selectedChartType = props.selectedChartType, onChartTypeChange = props.onChartTypeChange;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return ((0, jsx_runtime_1.jsx)(GridChartsManagementRoot, { ownerState: rootProps, className: classes.root, children: (0, jsx_runtime_1.jsx)(GridChartTypeRoot, { className: classes.chartTypeRoot, children: Object.entries(schema).map(function (_a) {
                var _b;
                var type = _a[0], config = _a[1];
                return ((0, jsx_runtime_1.jsxs)(GridChartTypeButton, __assign({ className: classes.button, isSelected: type === selectedChartType, onClick: function () { return onChartTypeChange(type); } }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseButton, { children: [(0, jsx_runtime_1.jsx)(config.icon, { style: { width: 32, height: 32 } }), config.label] }), type));
            }) }) }));
}
GridChartsPanelChart.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    schema: prop_types_1.default.object,
};
