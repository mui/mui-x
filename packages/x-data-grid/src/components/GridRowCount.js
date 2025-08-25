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
exports.GridRowCount = void 0;
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
        root: ['rowCount'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridRowCountRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'RowCount',
})({
    alignItems: 'center',
    display: 'flex',
    margin: cssVariables_1.vars.spacing(0, 2),
});
var GridRowCount = (0, forwardRef_1.forwardRef)(function GridRowCount(props, ref) {
    var className = props.className, rowCount = props.rowCount, visibleRowCount = props.visibleRowCount, other = __rest(props, ["className", "rowCount", "visibleRowCount"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(ownerState);
    if (rowCount === 0) {
        return null;
    }
    var text = visibleRowCount < rowCount
        ? apiRef.current.getLocaleText('footerTotalVisibleRows')(visibleRowCount, rowCount)
        : rowCount.toLocaleString();
    return (<GridRowCountRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={ownerState} {...other} ref={ref}>
        {apiRef.current.getLocaleText('footerTotalRows')} {text}
      </GridRowCountRoot>);
});
exports.GridRowCount = GridRowCount;
GridRowCount.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    rowCount: prop_types_1.default.number.isRequired,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    visibleRowCount: prop_types_1.default.number.isRequired,
};
