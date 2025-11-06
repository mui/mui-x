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
exports.Collapsible = Collapsible;
var jsx_runtime_1 = require("react/jsx-runtime");
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
    var className = props.className, children = props.children, _a = props.initiallyOpen, initiallyOpen = _a === void 0 ? true : _a, other = __rest(props, ["className", "children", "initiallyOpen"]);
    var _b = React.useState(initiallyOpen), open = _b[0], setOpen = _b[1];
    var panelId = (0, useId_1.default)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes, open: open };
    var classes = useUtilityClasses(ownerState);
    var contextValue = React.useMemo(function () { return ({ open: open, onOpenChange: setOpen, panelId: panelId }); }, [open, setOpen, panelId]);
    return ((0, jsx_runtime_1.jsx)(CollapsibleContext_1.CollapsibleContext.Provider, { value: contextValue, children: (0, jsx_runtime_1.jsx)(CollapsibleRoot, __assign({ ownerState: ownerState, className: (0, clsx_1.default)(classes.root, className) }, other, { children: children })) }));
}
