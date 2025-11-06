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
exports.CollapsibleTrigger = CollapsibleTrigger;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var clsx_1 = require("clsx");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var CollapsibleContext_1 = require("./CollapsibleContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['collapsibleTrigger'],
        icon: ['collapsibleIcon'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var CollapsibleTriggerRoot = (0, system_1.styled)('button', {
    name: 'MuiDataGrid',
    slot: 'CollapsibleTrigger',
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        padding: internals_1.vars.spacing(0, 1.5),
        border: "1px solid ".concat(internals_1.vars.colors.border.base),
        background: 'none',
        outline: 'none',
        borderTopLeftRadius: internals_1.vars.radius.base,
        borderTopRightRadius: internals_1.vars.radius.base,
        borderBottomLeftRadius: ownerState.open ? 0 : internals_1.vars.radius.base,
        borderBottomRightRadius: ownerState.open ? 0 : internals_1.vars.radius.base,
        '&:hover': {
            backgroundColor: internals_1.vars.colors.interactive.hover,
            cursor: 'pointer',
        },
        '&:focus-visible': {
            outline: "2px solid ".concat(internals_1.vars.colors.interactive.selected),
            outlineOffset: -2,
        },
    });
});
var CollapsibleIcon = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'CollapsibleIcon',
})(function (_a) {
    var ownerState = _a.ownerState;
    return ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: internals_1.vars.colors.foreground.muted,
        transform: ownerState.open ? 'none' : 'rotate(180deg)',
        transition: internals_1.vars.transition(['transform'], {
            duration: internals_1.vars.transitions.duration.short,
            easing: internals_1.vars.transitions.easing.easeInOut,
        }),
    });
});
function CollapsibleTrigger(props) {
    var children = props.children, className = props.className, other = __rest(props, ["children", "className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _a = (0, CollapsibleContext_1.useCollapsibleContext)(), open = _a.open, onOpenChange = _a.onOpenChange, panelId = _a.panelId;
    var ownerState = { classes: rootProps.classes, open: open };
    var classes = useUtilityClasses(ownerState);
    return ((0, jsx_runtime_1.jsxs)(CollapsibleTriggerRoot, __assign({ ownerState: ownerState, className: (0, clsx_1.default)(classes.root, className), tabIndex: 0, "aria-controls": open ? panelId : undefined, "aria-expanded": !open, onClick: function () { return onOpenChange(!open); } }, other, { children: [children, (0, jsx_runtime_1.jsx)(CollapsibleIcon, { ownerState: ownerState, className: classes.icon, children: (0, jsx_runtime_1.jsx)(rootProps.slots.collapsibleIcon, {}) })] })));
}
