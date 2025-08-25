"use strict";
'use client';
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
exports.Collapsible = Collapsible;
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var useId_1 = require("@mui/utils/useId");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var clsx_1 = require("clsx");
var CollapsibleContext_1 = require("./CollapsibleContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['collapsible'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var CollapsibleRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'Collapsible',
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        display: 'flex',
        flexDirection: 'column',
        flex: ownerState.open ? '1 0 auto' : '0 0 auto',
        borderRadius: internals_1.vars.radius.base,
    });
});
function Collapsible(props) {
    var className = props.className, children = props.children, other = __rest(props, ["className", "children"]);
    var _a = React.useState(true), open = _a[0], setOpen = _a[1];
    var panelId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes, open: open };
    var classes = useUtilityClasses(ownerState);
    var contextValue = React.useMemo(function () { return ({ open: open, onOpenChange: setOpen, panelId: panelId }); }, [open, setOpen, panelId]);
    return (<CollapsibleContext_1.CollapsibleContext.Provider value={contextValue}>
      <CollapsibleRoot ownerState={ownerState} className={(0, clsx_1.default)(classes.root, className)} {...other}>
        {children}
      </CollapsibleRoot>
    </CollapsibleContext_1.CollapsibleContext.Provider>);
}
