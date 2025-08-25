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
exports.GridToolbar = void 0;
var React = require("react");
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
    return (<GridToolbarContainer_1.GridToolbarContainer {...other} ref={ref}>
      {rootProps.label && <GridToolbar_1.GridToolbarLabel>{rootProps.label}</GridToolbar_1.GridToolbarLabel>}
      <GridToolbarColumnsButton_1.GridToolbarColumnsButton />
      <GridToolbarFilterButton_1.GridToolbarFilterButton />
      <GridToolbarDensitySelector_1.GridToolbarDensitySelector />
      <GridToolbarExport_1.GridToolbarExport csvOptions={csvOptions} printOptions={printOptions} 
    // @ts-ignore
    excelOptions={excelOptions}/>
      <div style={{ flex: 1 }}/>
      {showQuickFilter && <GridToolbarQuickFilter_1.GridToolbarQuickFilter {...quickFilterProps}/>}
    </GridToolbarContainer_1.GridToolbarContainer>);
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
