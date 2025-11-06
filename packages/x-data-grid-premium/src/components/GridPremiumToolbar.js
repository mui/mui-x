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
exports.GridPremiumToolbar = GridPremiumToolbar;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var export_1 = require("./export");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var PivotPanelTrigger_1 = require("./pivotPanel/PivotPanelTrigger");
var aiAssistantPanel_1 = require("./aiAssistantPanel");
var ChartsPanelTrigger_1 = require("./chartsPanel/ChartsPanelTrigger");
function GridPremiumToolbar(props) {
    var _a, _b;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var excelOptions = props.excelOptions, other = __rest(props, ["excelOptions"]);
    var additionalItems = ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [!rootProps.disablePivoting && ((0, jsx_runtime_1.jsx)(PivotPanelTrigger_1.PivotPanelTrigger, { render: function (triggerProps, state) { return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarPivot'), children: (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.ToolbarButton, __assign({}, triggerProps, { color: state.active ? 'primary' : 'default', children: (0, jsx_runtime_1.jsx)(rootProps.slots.pivotIcon, { fontSize: "small" }) })) })); } })), ((_a = rootProps.experimentalFeatures) === null || _a === void 0 ? void 0 : _a.charts) && rootProps.chartsIntegration && ((0, jsx_runtime_1.jsx)(ChartsPanelTrigger_1.ChartsPanelTrigger, { render: function (triggerProps) { return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarCharts'), children: (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.ToolbarButton, __assign({}, triggerProps, { color: "default", children: (0, jsx_runtime_1.jsx)(rootProps.slots.chartsIcon, { fontSize: "small" }) })) })); } })), rootProps.aiAssistant && ((0, jsx_runtime_1.jsx)(aiAssistantPanel_1.AiAssistantPanelTrigger, { render: function (triggerProps) { return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('toolbarAssistant'), children: (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.ToolbarButton, __assign({}, triggerProps, { color: "default", children: (0, jsx_runtime_1.jsx)(rootProps.slots.aiAssistantIcon, { fontSize: "small" }) })) })); } }))] }));
    var additionalExportMenuItems = !((_b = props.excelOptions) === null || _b === void 0 ? void 0 : _b.disableToolbarButton)
        ? function (onMenuItemClick) {
            var _a;
            return ((0, jsx_runtime_1.jsx)(export_1.ExportExcel, { render: (0, jsx_runtime_1.jsx)(rootProps.slots.baseMenuItem, __assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseMenuItem)), options: props.excelOptions, onClick: onMenuItemClick, children: apiRef.current.getLocaleText('toolbarExportExcel') }));
        }
        : undefined;
    return ((0, jsx_runtime_1.jsx)(internals_1.GridToolbar, __assign({}, other, { additionalItems: additionalItems, additionalExportMenuItems: additionalExportMenuItems })));
}
