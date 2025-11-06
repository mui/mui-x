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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridSelectedRowCount = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var cssVariables_1 = require("../constants/cssVariables");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridClasses_1 = require("../constants/gridClasses");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['selectedRowCount'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridSelectedRowCountRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'SelectedRowCount',
})((_a = {
        alignItems: 'center',
        display: 'flex',
        margin: cssVariables_1.vars.spacing(0, 2),
        visibility: 'hidden',
        width: 0,
        height: 0
    },
    _a[cssVariables_1.vars.breakpoints.up('sm')] = {
        visibility: 'visible',
        width: 'auto',
        height: 'auto',
    },
    _a));
var GridSelectedRowCount = (0, forwardRef_1.forwardRef)(function GridSelectedRowCount(props, ref) {
    var className = props.className, selectedRowCount = props.selectedRowCount, other = __rest(props, ["className", "selectedRowCount"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(ownerState);
    var rowSelectedText = apiRef.current.getLocaleText('footerRowSelected')(selectedRowCount);
    return ((0, jsx_runtime_1.jsx)(GridSelectedRowCountRoot, __assign({ className: (0, clsx_1.default)(classes.root, className), ownerState: ownerState }, other, { ref: ref, children: rowSelectedText })));
});
exports.GridSelectedRowCount = GridSelectedRowCount;
GridSelectedRowCount.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    selectedRowCount: prop_types_1.default.number.isRequired,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
