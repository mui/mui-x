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
exports.GridToolbar = GridToolbar;
exports.GridToolbarDivider = GridToolbarDivider;
exports.GridToolbarLabel = GridToolbarLabel;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useId_1 = require("@mui/utils/useId");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var GridMenu_1 = require("../menu/GridMenu");
var Toolbar_1 = require("./Toolbar");
var ToolbarButton_1 = require("./ToolbarButton");
var filterPanel_1 = require("../filterPanel");
var columnsPanel_1 = require("../columnsPanel");
var export_1 = require("../export");
var GridToolbarQuickFilter_1 = require("../toolbar/GridToolbarQuickFilter");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var assert_1 = require("../../utils/assert");
var cssVariables_1 = require("../../constants/cssVariables");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        divider: ['toolbarDivider'],
        label: ['toolbarLabel'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var Divider = (0, system_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'ToolbarDivider',
})({
    height: '50%',
    margin: cssVariables_1.vars.spacing(0, 0.5),
});
var Label = (0, system_1.styled)('span', {
    name: 'MuiDataGrid',
    slot: 'ToolbarLabel',
})({
    flex: 1,
    font: cssVariables_1.vars.typography.font.large,
    fontWeight: cssVariables_1.vars.typography.fontWeight.medium,
    margin: cssVariables_1.vars.spacing(0, 0.5),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
});
function GridToolbarDivider(props) {
    var className = props.className, other = __rest(props, ["className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return ((0, jsx_runtime_1.jsx)(Divider, __assign({ as: rootProps.slots.baseDivider, orientation: "vertical", className: classes.divider }, other)));
}
GridToolbarDivider.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    orientation: prop_types_1.default.oneOf(['horizontal', 'vertical']),
};
function GridToolbarLabel(props) {
    var className = props.className, other = __rest(props, ["className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return (0, jsx_runtime_1.jsx)(Label, __assign({ className: classes.label }, other));
}
function GridToolbar(props) {
    var _a, _b, _c;
    var _d = props.showQuickFilter, showQuickFilter = _d === void 0 ? true : _d, quickFilterProps = props.quickFilterProps, csvOptions = props.csvOptions, printOptions = props.printOptions, additionalItems = props.additionalItems, additionalExportMenuItems = props.additionalExportMenuItems, other = __rest(props, ["showQuickFilter", "quickFilterProps", "csvOptions", "printOptions", "additionalItems", "additionalExportMenuItems"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _e = React.useState(false), exportMenuOpen = _e[0], setExportMenuOpen = _e[1];
    var exportMenuTriggerRef = React.useRef(null);
    var exportMenuId = (0, useId_1.default)();
    var exportMenuTriggerId = (0, useId_1.default)();
    var showExportMenu = !(csvOptions === null || csvOptions === void 0 ? void 0 : csvOptions.disableToolbarButton) ||
        !(printOptions === null || printOptions === void 0 ? void 0 : printOptions.disableToolbarButton) ||
        additionalExportMenuItems;
    var closeExportMenu = function () { return setExportMenuOpen(false); };
    return ((0, jsx_runtime_1.jsxs)(Toolbar_1.Toolbar, __assign({}, other, { children: [rootProps.label && (0, jsx_runtime_1.jsx)(GridToolbarLabel, { children: rootProps.label }), !rootProps.disableColumnSelector && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarColumns'), children: (0, jsx_runtime_1.jsx)(columnsPanel_1.ColumnsPanelTrigger, { render: (0, jsx_runtime_1.jsx)(ToolbarButton_1.ToolbarButton, {}), children: (0, jsx_runtime_1.jsx)(rootProps.slots.columnSelectorIcon, { fontSize: "small" }) }) })), !rootProps.disableColumnFilter && ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarFilters'), children: (0, jsx_runtime_1.jsx)(filterPanel_1.FilterPanelTrigger, { render: function (triggerProps, state) { return ((0, jsx_runtime_1.jsx)(ToolbarButton_1.ToolbarButton, __assign({}, triggerProps, { color: state.filterCount > 0 ? 'primary' : 'default', children: (0, jsx_runtime_1.jsx)(rootProps.slots.baseBadge, { badgeContent: state.filterCount, color: "primary", variant: "dot", children: (0, jsx_runtime_1.jsx)(rootProps.slots.openFilterButtonIcon, { fontSize: "small" }) }) }))); } }) })), additionalItems, showExportMenu && (!rootProps.disableColumnFilter || !rootProps.disableColumnSelector) && ((0, jsx_runtime_1.jsx)(GridToolbarDivider, {})), showExportMenu && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarExport'), disableInteractive: exportMenuOpen, children: (0, jsx_runtime_1.jsx)(ToolbarButton_1.ToolbarButton, { ref: exportMenuTriggerRef, id: exportMenuTriggerId, "aria-controls": exportMenuId, "aria-haspopup": "true", "aria-expanded": exportMenuOpen ? 'true' : undefined, onClick: function () { return setExportMenuOpen(!exportMenuOpen); }, children: (0, jsx_runtime_1.jsx)(rootProps.slots.exportIcon, { fontSize: "small" }) }) }), (0, jsx_runtime_1.jsx)(GridMenu_1.GridMenu, { target: exportMenuTriggerRef.current, open: exportMenuOpen, onClose: closeExportMenu, position: "bottom-end", children: (0, jsx_runtime_1.jsxs)(rootProps.slots.baseMenuList, __assign({ id: exportMenuId, "aria-labelledby": exportMenuTriggerId, autoFocusItem: true }, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuList, { children: [!(printOptions === null || printOptions === void 0 ? void 0 : printOptions.disableToolbarButton) && ((0, jsx_runtime_1.jsx)(export_1.ExportPrint, { render: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({}, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseMenuItem)), options: printOptions, onClick: closeExportMenu, children: apiRef.current.getLocaleText('toolbarExportPrint') })), !(csvOptions === null || csvOptions === void 0 ? void 0 : csvOptions.disableToolbarButton) && ((0, jsx_runtime_1.jsx)(export_1.ExportCsv, { render: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({}, (_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseMenuItem)), options: csvOptions, onClick: closeExportMenu, children: apiRef.current.getLocaleText('toolbarExportCSV') })), additionalExportMenuItems === null || additionalExportMenuItems === void 0 ? void 0 : additionalExportMenuItems(closeExportMenu)] })) })] })), showQuickFilter && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridToolbarDivider, {}), (0, jsx_runtime_1.jsx)(GridToolbarQuickFilter_1.GridToolbarQuickFilter, __assign({}, quickFilterProps))] }))] })));
}
GridToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    additionalExportMenuItems: prop_types_1.default.func,
    additionalItems: prop_types_1.default.node,
    csvOptions: prop_types_1.default.object,
    printOptions: prop_types_1.default.object,
    /**
     * Props passed to the quick filter component.
     */
    quickFilterProps: prop_types_1.default.shape({
        className: prop_types_1.default.string,
        debounceMs: prop_types_1.default.number,
        quickFilterFormatter: prop_types_1.default.func,
        quickFilterParser: prop_types_1.default.func,
        slotProps: prop_types_1.default.object,
    }),
    /**
     * Show the quick filter component.
     * @default true
     */
    showQuickFilter: prop_types_1.default.bool,
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
