"use strict";
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
exports.Sidebar = Sidebar;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var resizablePanel_1 = require("../resizablePanel");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var sidebar_1 = require("../../hooks/features/sidebar");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['sidebar'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var SidebarRoot = (0, system_1.styled)(resizablePanel_1.ResizablePanel, {
    name: 'MuiDataGrid',
    slot: 'Sidebar',
})({
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    minWidth: 260,
    maxWidth: 400,
    overflow: 'hidden',
});
function Sidebar(props) {
    var className = props.className, children = props.children, other = __rest(props, ["className", "children"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var _a = (0, x_data_grid_pro_1.useGridSelector)(apiRef, sidebar_1.gridSidebarContentSelector), value = _a.value, sidebarId = _a.sidebarId, labelId = _a.labelId;
    if (!value) {
        return null;
    }
    var sidebarContent = apiRef.current.unstable_applyPipeProcessors('sidebar', null, value);
    if (!sidebarContent) {
        return null;
    }
    return (<SidebarRoot id={sidebarId} className={(0, clsx_1.default)(className, classes.root)} ownerState={rootProps} aria-labelledby={labelId} {...other}>
      <resizablePanel_1.ResizablePanelHandle />
      {sidebarContent}
    </SidebarRoot>);
}
