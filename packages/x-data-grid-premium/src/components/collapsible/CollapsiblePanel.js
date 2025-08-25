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
exports.CollapsiblePanel = CollapsiblePanel;
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useId_1 = require("@mui/utils/useId");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var clsx_1 = require("clsx");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var CollapsibleContext_1 = require("./CollapsibleContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['collapsiblePanel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var CollapsiblePanelRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'CollapsiblePanel',
})({
    border: "1px solid ".concat(internals_1.vars.colors.border.base),
    borderTop: 'none',
    borderBottomLeftRadius: internals_1.vars.radius.base,
    borderBottomRightRadius: internals_1.vars.radius.base,
    flex: 1,
    overflow: 'hidden',
});
function CollapsiblePanel(props) {
    var ariaLabel = props["aria-label"], children = props.children, className = props.className, other = __rest(props, ['aria-label', "children", "className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var id = (0, useId_1.default)();
    var open = (0, CollapsibleContext_1.useCollapsibleContext)().open;
    if (!open) {
        return null;
    }
    return (<CollapsiblePanelRoot ownerState={rootProps} className={(0, clsx_1.default)(classes.root, className)} id={id} {...other}>
      {children}
    </CollapsiblePanelRoot>);
}
