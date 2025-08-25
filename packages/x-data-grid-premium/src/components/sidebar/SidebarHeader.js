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
exports.SidebarHeader = SidebarHeader;
var React = require("react");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var clsx_1 = require("clsx");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['sidebarHeader'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var SidebarHeaderRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'SidebarHeader',
})({
    position: 'sticky',
    top: 0,
    borderBottom: "1px solid ".concat(internals_1.vars.colors.border.base),
});
function SidebarHeader(props) {
    var className = props.className, children = props.children, other = __rest(props, ["className", "children"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return (<SidebarHeaderRoot className={(0, clsx_1.default)(className, classes.root)} ownerState={rootProps} {...other}>
      {children}
    </SidebarHeaderRoot>);
}
