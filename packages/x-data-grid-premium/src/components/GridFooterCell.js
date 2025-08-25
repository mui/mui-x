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
exports.GridFooterCell = GridFooterCell;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var styles_1 = require("@mui/material/styles");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var GridFooterCellRoot = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'FooterCell',
})({
    fontWeight: internals_1.vars.typography.fontWeight.medium,
    color: internals_1.vars.colors.foreground.accent,
});
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['footerCell'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
function GridFooterCell(props) {
    var formattedValue = props.formattedValue, colDef = props.colDef, cellMode = props.cellMode, row = props.row, api = props.api, id = props.id, value = props.value, rowNode = props.rowNode, field = props.field, focusElementRef = props.focusElementRef, hasFocus = props.hasFocus, tabIndex = props.tabIndex, isEditable = props.isEditable, other = __rest(props, ["formattedValue", "colDef", "cellMode", "row", "api", "id", "value", "rowNode", "field", "focusElementRef", "hasFocus", "tabIndex", "isEditable"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = rootProps;
    var classes = useUtilityClasses(ownerState);
    return (<GridFooterCellRoot ownerState={ownerState} className={classes.root} {...other}>
      {formattedValue}
    </GridFooterCellRoot>);
}
