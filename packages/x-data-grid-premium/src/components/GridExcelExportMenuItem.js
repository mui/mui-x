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
exports.GridExcelExportMenuItem = GridExcelExportMenuItem;
var React = require("react");
var prop_types_1 = require("prop-types");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
function GridExcelExportMenuItem(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var hideMenu = props.hideMenu, options = props.options, other = __rest(props, ["hideMenu", "options"]);
    return (<rootProps.slots.baseMenuItem onClick={function () {
            apiRef.current.exportDataAsExcel(options);
            hideMenu === null || hideMenu === void 0 ? void 0 : hideMenu();
        }} {...other}>
      {apiRef.current.getLocaleText('toolbarExportExcel')}
    </rootProps.slots.baseMenuItem>);
}
GridExcelExportMenuItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    hideMenu: prop_types_1.default.func,
    options: prop_types_1.default.shape({
        allColumns: prop_types_1.default.bool,
        columnsStyles: prop_types_1.default.object,
        disableToolbarButton: prop_types_1.default.bool,
        escapeFormulas: prop_types_1.default.bool,
        exceljsPostProcess: prop_types_1.default.func,
        exceljsPreProcess: prop_types_1.default.func,
        fields: prop_types_1.default.arrayOf(prop_types_1.default.string),
        fileName: prop_types_1.default.string,
        getRowsToExport: prop_types_1.default.func,
        includeColumnGroupsHeaders: prop_types_1.default.bool,
        includeHeaders: prop_types_1.default.bool,
        valueOptionsSheetName: prop_types_1.default.string,
        worker: prop_types_1.default.func,
    }),
};
