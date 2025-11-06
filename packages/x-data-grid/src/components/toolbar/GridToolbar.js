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
exports.GridToolbar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var GridToolbarContainer_1 = require("../containers/GridToolbarContainer");
var GridToolbarColumnsButton_1 = require("./GridToolbarColumnsButton");
var GridToolbarDensitySelector_1 = require("./GridToolbarDensitySelector");
var GridToolbarFilterButton_1 = require("./GridToolbarFilterButton");
var GridToolbarExport_1 = require("./GridToolbarExport");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridToolbarQuickFilter_1 = require("./GridToolbarQuickFilter");
var GridToolbar_1 = require("../toolbarV8/GridToolbar");
/**
 * @deprecated Use the `showToolbar` prop to show the default toolbar instead. This component will be removed in a future major release.
 */
var GridToolbar = (0, forwardRef_1.forwardRef)(function GridToolbar(props, ref) {
    // TODO v7: think about where export option should be passed.
    // from slotProps={{ toolbarExport: { ...exportOption } }} seems to be more appropriate
    var _a = props, className = _a.className, csvOptions = _a.csvOptions, printOptions = _a.printOptions, excelOptions = _a.excelOptions, _b = _a.showQuickFilter, showQuickFilter = _b === void 0 ? true : _b, _c = _a.quickFilterProps, quickFilterProps = _c === void 0 ? {} : _c, other = __rest(_a, ["className", "csvOptions", "printOptions", "excelOptions", "showQuickFilter", "quickFilterProps"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (rootProps.disableColumnFilter &&
        rootProps.disableColumnSelector &&
        rootProps.disableDensitySelector &&
        !showQuickFilter) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(GridToolbarContainer_1.GridToolbarContainer, __assign({}, other, { ref: ref, children: [rootProps.label && (0, jsx_runtime_1.jsx)(GridToolbar_1.GridToolbarLabel, { children: rootProps.label }), (0, jsx_runtime_1.jsx)(GridToolbarColumnsButton_1.GridToolbarColumnsButton, {}), (0, jsx_runtime_1.jsx)(GridToolbarFilterButton_1.GridToolbarFilterButton, {}), (0, jsx_runtime_1.jsx)(GridToolbarDensitySelector_1.GridToolbarDensitySelector, {}), (0, jsx_runtime_1.jsx)(GridToolbarExport_1.GridToolbarExport, { csvOptions: csvOptions, printOptions: printOptions, 
                // @ts-ignore
                excelOptions: excelOptions }), (0, jsx_runtime_1.jsx)("div", { style: { flex: 1 } }), showQuickFilter && (0, jsx_runtime_1.jsx)(GridToolbarQuickFilter_1.GridToolbarQuickFilter, __assign({}, quickFilterProps))] })));
});
exports.GridToolbar = GridToolbar;
GridToolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    csvOptions: prop_types_1.default.object,
    printOptions: prop_types_1.default.object,
    /**
     * Props passed to the quick filter component.
     */
    quickFilterProps: prop_types_1.default.shape({
        className: prop_types_1.default.string,
        debounceMs: prop_types_1.default.number,
        quickFilterFormatter: prop_types_1.default.func,
        quickFilterParser: prop_types_1.default.func,
        slotProps: prop_types_1.default.object,
    }),
    /**
     * Show the quick filter component.
     * @default true
     */
    showQuickFilter: prop_types_1.default.bool,
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
