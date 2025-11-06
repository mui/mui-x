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
exports.GridChartsPanel = GridChartsPanel;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var system_1 = require("@mui/system");
var useId_1 = require("@mui/utils/useId");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridChartsPanelChart_1 = require("./chart/GridChartsPanelChart");
var GridChartsPanelCustomize_1 = require("./customize/GridChartsPanelCustomize");
var gridChartsIntegrationSelectors_1 = require("../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors");
var useGridChartIntegration_1 = require("../../hooks/utils/useGridChartIntegration");
var GridChartsPanelData_1 = require("./data/GridChartsPanelData");
var GridChartsPanelHeader = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelHeader',
})({
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(0.25),
    padding: internals_1.vars.spacing(1, 0.5, 0, 0.75),
    boxSizing: 'border-box',
});
var GridChartsPanelTitle = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelTitle',
})({
    font: internals_1.vars.typography.font.large,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
    marginLeft: internals_1.vars.spacing(0.5),
    marginRight: 'auto',
});
var GridChartsPanelChartSelection = (0, system_1.styled)('button', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelChartSelection',
})({
    display: 'flex',
    alignItems: 'center',
    gap: internals_1.vars.spacing(0.25),
    padding: internals_1.vars.spacing(0.75, 0.5),
    borderRadius: internals_1.vars.radius.base,
    font: internals_1.vars.typography.font.large,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    outline: 'none',
    marginRight: 'auto',
    '&:hover, &:focus-visible': {
        backgroundColor: internals_1.vars.colors.interactive.hover,
    },
});
function GridChartsPanelChartSelector(props) {
    var _a, _b;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var activeChartId = props.activeChartId, chartEntries = props.chartEntries;
    var triggerRef = React.useRef(null);
    var _c = React.useState(false), open = _c[0], setOpen = _c[1];
    var menuId = (0, useId_1.default)();
    var triggerId = (0, useId_1.default)();
    var activeChart = chartEntries.find(function (_a) {
        var chartId = _a[0];
        return chartId === activeChartId;
    });
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GridChartsPanelChartSelection, { id: triggerId, "aria-haspopup": "true", "aria-controls": open ? menuId : undefined, "aria-expanded": open ? 'true' : undefined, ownerState: rootProps, onClick: function () { return setOpen(!open); }, ref: triggerRef, children: [(_a = activeChart === null || activeChart === void 0 ? void 0 : activeChart[1]) === null || _a === void 0 ? void 0 : _a.label, (0, jsx_runtime_1.jsx)(rootProps.slots.promptChangesToggleIcon, { fontSize: "small" })] }), (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridMenu, { open: open, target: triggerRef.current, onClose: function () { return setOpen(false); }, position: "bottom-start", children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuList, __assign({ id: menuId, "aria-labelledby": triggerId, autoFocusItem: true }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuList, { children: chartEntries.map(function (_a) {
                        var _b;
                        var chartId = _a[0], chartState = _a[1];
                        return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({ value: chartId, onClick: function () {
                                apiRef.current.setActiveChartId(chartId);
                                setOpen(false);
                            }, selected: chartId === activeChartId }, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuItem, { children: chartState.label || chartId }), chartId));
                    }) })) })] }));
}
GridChartsPanelChartSelector.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    activeChartId: prop_types_1.default.string.isRequired,
    chartEntries: prop_types_1.default.arrayOf(prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            configuration: prop_types_1.default.object.isRequired,
            dimensions: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                data: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]))
                    .isRequired,
                id: prop_types_1.default.string.isRequired,
                label: prop_types_1.default.string.isRequired,
            })).isRequired,
            dimensionsLabel: prop_types_1.default.string,
            label: prop_types_1.default.string,
            maxDimensions: prop_types_1.default.number,
            maxValues: prop_types_1.default.number,
            synced: prop_types_1.default.bool.isRequired,
            type: prop_types_1.default.string.isRequired,
            values: prop_types_1.default.arrayOf(prop_types_1.default.shape({
                data: prop_types_1.default.arrayOf(prop_types_1.default.number).isRequired,
                id: prop_types_1.default.string.isRequired,
                label: prop_types_1.default.string.isRequired,
            })).isRequired,
            valuesLabel: prop_types_1.default.string,
        }),
        prop_types_1.default.string,
    ]).isRequired)).isRequired,
};
function GridChartsPanel(props) {
    var _a, _b, _c, _d;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _e = props.schema, schema = _e === void 0 ? {} : _e;
    var activeChartId = (0, internals_1.useGridSelector)(apiRef, gridChartsIntegrationSelectors_1.gridChartsIntegrationActiveChartIdSelector);
    var chartStateLookup = (0, useGridChartIntegration_1.useGridChartsIntegrationContext)().chartStateLookup;
    var _f = React.useState('chart'), activeTab = _f[0], setActiveTab = _f[1];
    var chartEntries = React.useMemo(function () { return Object.entries(chartStateLookup); }, [chartStateLookup]);
    var activeChartType = React.useMemo(function () { var _a; return ((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.type) || ''; }, [chartStateLookup, activeChartId]);
    var currentChartConfiguration = React.useMemo(function () {
        return schema[activeChartType] || {};
    }, [schema, activeChartType]);
    var handleChartSyncChange = React.useCallback(function (newSyncState) {
        apiRef.current.setChartSynchronizationState(activeChartId, newSyncState);
    }, [apiRef, activeChartId]);
    var handleChartTypeChange = React.useCallback(function (type) {
        apiRef.current.setChartType(activeChartId, type);
    }, [apiRef, activeChartId]);
    var tabItems = React.useMemo(function () {
        var _a;
        return [
            {
                value: 'chart',
                label: apiRef.current.getLocaleText('chartsTabChart'),
                children: ((0, jsx_runtime_1.jsx)(GridChartsPanelChart_1.GridChartsPanelChart, { schema: schema, selectedChartType: (_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.type, onChartTypeChange: handleChartTypeChange })),
            },
            {
                value: 'data',
                label: apiRef.current.getLocaleText('chartsTabFields'),
                children: (0, jsx_runtime_1.jsx)(GridChartsPanelData_1.GridChartsPanelData, {}),
            },
            {
                value: 'customize',
                label: apiRef.current.getLocaleText('chartsTabCustomize'),
                children: ((0, jsx_runtime_1.jsx)(GridChartsPanelCustomize_1.GridChartsPanelCustomize, { activeChartId: activeChartId, sections: currentChartConfiguration.customization || [] })),
            },
        ];
    }, [
        apiRef,
        activeChartId,
        chartStateLookup,
        handleChartTypeChange,
        schema,
        currentChartConfiguration,
    ]);
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsxs)(GridChartsPanelHeader, { ownerState: rootProps, children: [chartEntries.length > 1 ? ((0, jsx_runtime_1.jsx)(GridChartsPanelChartSelector, { activeChartId: activeChartId, chartEntries: chartEntries })) : ((0, jsx_runtime_1.jsx)(GridChartsPanelTitle, { ownerState: rootProps, children: "Charts" })), chartEntries.length > 0 && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: rootProps.localeText.chartsSyncButtonLabel, children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseToggleButton, { value: "sync", "aria-label": rootProps.localeText.chartsSyncButtonLabel, selected: (_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.synced, onClick: function () {
                                var _a;
                                handleChartSyncChange(!((_a = chartStateLookup[activeChartId]) === null || _a === void 0 ? void 0 : _a.synced));
                            }, children: ((_b = chartStateLookup[activeChartId]) === null || _b === void 0 ? void 0 : _b.synced) ? ((0, jsx_runtime_1.jsx)(rootProps.slots.chartsSyncIcon, { fontSize: "small" })) : ((0, jsx_runtime_1.jsx)(rootProps.slots.chartsSyncDisabledIcon, { fontSize: "small" })) }) })), (0, jsx_runtime_1.jsx)(rootProps.slots.baseIconButton, __assign({ onClick: function () {
                            apiRef.current.setChartsPanelOpen(false);
                        }, "aria-label": apiRef.current.getLocaleText('chartsCloseButton') }, (_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseIconButton, { children: (0, jsx_runtime_1.jsx)(rootProps.slots.sidebarCloseIcon, { fontSize: "small" }) }))] }), chartEntries.length > 0 ? ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTabs, __assign({ items: tabItems, value: activeTab, onChange: function (_event, value) {
                    setActiveTab(value);
                } }, (_d = rootProps.slotProps) === null || _d === void 0 ? void 0 : _d.baseTabs))) : ((0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridOverlay, { children: apiRef.current.getLocaleText('chartsNoCharts') }))] }));
}
GridChartsPanel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override the default column name generation logic. Use field in combination with the grid state to determine the name of the column that will be shown to the user.
     * @param {string} field The field name
     * @returns {string | undefined} The name of the column or undefined if the column name should be determined by the grid
     */
    getColumnName: prop_types_1.default.func,
    /**
     * The schema of the charts configuration.
     * @type {GridChartsConfigurationOptions}
     * @default {}
     */
    schema: prop_types_1.default.object,
};
