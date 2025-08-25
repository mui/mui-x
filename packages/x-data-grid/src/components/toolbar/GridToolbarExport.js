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
exports.GridToolbarExport = void 0;
exports.GridCsvExportMenuItem = GridCsvExportMenuItem;
exports.GridPrintExportMenuItem = GridPrintExportMenuItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var GridToolbarExportContainer_1 = require("./GridToolbarExportContainer");
function GridCsvExportMenuItem(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var hideMenu = props.hideMenu, options = props.options, other = __rest(props, ["hideMenu", "options"]);
    return (<rootProps.slots.baseMenuItem onClick={function () {
            apiRef.current.exportDataAsCsv(options);
            hideMenu === null || hideMenu === void 0 ? void 0 : hideMenu();
        }} {...other}>
      {apiRef.current.getLocaleText('toolbarExportCSV')}
    </rootProps.slots.baseMenuItem>);
}
GridCsvExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: prop_types_1.default.func,
    options: prop_types_1.default.shape({
        allColumns: prop_types_1.default.bool,
        delimiter: prop_types_1.default.string,
        disableToolbarButton: prop_types_1.default.bool,
        escapeFormulas: prop_types_1.default.bool,
        fields: prop_types_1.default.arrayOf(prop_types_1.default.string),
        fileName: prop_types_1.default.string,
        getRowsToExport: prop_types_1.default.func,
        includeColumnGroupsHeaders: prop_types_1.default.bool,
        includeHeaders: prop_types_1.default.bool,
        shouldAppendQuotes: prop_types_1.default.bool,
        utf8WithBom: prop_types_1.default.bool,
    }),
};
function GridPrintExportMenuItem(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var hideMenu = props.hideMenu, options = props.options, other = __rest(props, ["hideMenu", "options"]);
    return (<rootProps.slots.baseMenuItem onClick={function () {
            apiRef.current.exportDataAsPrint(options);
            hideMenu === null || hideMenu === void 0 ? void 0 : hideMenu();
        }} {...other}>
      {apiRef.current.getLocaleText('toolbarExportPrint')}
    </rootProps.slots.baseMenuItem>);
}
GridPrintExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: prop_types_1.default.func,
    options: prop_types_1.default.shape({
        allColumns: prop_types_1.default.bool,
        bodyClassName: prop_types_1.default.string,
        copyStyles: prop_types_1.default.bool,
        disableToolbarButton: prop_types_1.default.bool,
        fields: prop_types_1.default.arrayOf(prop_types_1.default.string),
        fileName: prop_types_1.default.string,
        getRowsToExport: prop_types_1.default.func,
        hideFooter: prop_types_1.default.bool,
        hideToolbar: prop_types_1.default.bool,
        includeCheckboxes: prop_types_1.default.bool,
        pageStyle: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    }),
};
/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/export/ Export} components instead. This component will be removed in a future major release.
 */
var GridToolbarExport = (0, forwardRef_1.forwardRef)(function GridToolbarExport(props, ref) {
    var _a = props, _b = _a.csvOptions, csvOptions = _b === void 0 ? {} : _b, _c = _a.printOptions, printOptions = _c === void 0 ? {} : _c, excelOptions = _a.excelOptions, other = __rest(_a, ["csvOptions", "printOptions", "excelOptions"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var preProcessedButtons = apiRef.current
        .unstable_applyPipeProcessors('exportMenu', [], { excelOptions: excelOptions, csvOptions: csvOptions, printOptions: printOptions })
        .sort(function (a, b) { return (a.componentName > b.componentName ? 1 : -1); });
    if (preProcessedButtons.length === 0) {
        return null;
    }
    return (<GridToolbarExportContainer_1.GridToolbarExportContainer {...other} ref={ref}>
        {preProcessedButtons.map(function (button, index) {
            return React.cloneElement(button.component, { key: index });
        })}
      </GridToolbarExportContainer_1.GridToolbarExportContainer>);
});
exports.GridToolbarExport = GridToolbarExport;
GridToolbarExport.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    csvOptions: prop_types_1.default.object,
    printOptions: prop_types_1.default.object,
    /**
     * The props used for each slot inside.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
};
