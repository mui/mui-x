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
exports.GridBaseColumnHeaders = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['columnHeaders'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridColumnHeadersRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaders',
})({
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
    borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
});
exports.GridBaseColumnHeaders = (0, forwardRef_1.forwardRef)(function GridColumnHeaders(props, ref) {
    var className = props.className, other = __rest(props, ["className"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    return (<GridColumnHeadersRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={rootProps} {...other} role="presentation" ref={ref}/>);
});
