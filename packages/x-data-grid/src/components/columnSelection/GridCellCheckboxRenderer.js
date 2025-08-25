"use strict";
'use client';
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
exports.GridCellCheckboxRenderer = exports.GridCellCheckboxForwardRef = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var utils_1 = require("../../hooks/features/rowSelection/utils");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['checkboxInput'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var GridCellCheckboxForwardRef = (0, forwardRef_1.forwardRef)(function GridCellCheckboxRenderer(props, ref) {
    var _a, _b, _c;
    var field = props.field, id = props.id, formattedValue = props.formattedValue, row = props.row, rowNode = props.rowNode, colDef = props.colDef, isEditable = props.isEditable, cellMode = props.cellMode, hasFocus = props.hasFocus, tabIndex = props.tabIndex, api = props.api, other = __rest(props, ["field", "id", "formattedValue", "row", "rowNode", "colDef", "isEditable", "cellMode", "hasFocus", "tabIndex", "api"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var handleChange = function (event) {
        var params = { value: event.target.checked, id: id };
        apiRef.current.publishEvent('rowSelectionCheckboxChange', params, event);
    };
    React.useLayoutEffect(function () {
        if (tabIndex === 0) {
            var element = apiRef.current.getCellElement(id, field);
            if (element) {
                element.tabIndex = -1;
            }
        }
    }, [apiRef, tabIndex, id, field]);
    var handleKeyDown = React.useCallback(function (event) {
        if (event.key === ' ') {
            // We call event.stopPropagation to avoid selecting the row and also scrolling to bottom
            // TODO: Remove and add a check inside useGridKeyboardNavigation
            event.stopPropagation();
        }
    }, []);
    var isSelectable = apiRef.current.isRowSelectable(id);
    var _d = (0, useGridSelector_1.useGridSelector)(apiRef, utils_1.checkboxPropsSelector, {
        groupId: id,
        autoSelectParents: (_b = (_a = rootProps.rowSelectionPropagation) === null || _a === void 0 ? void 0 : _a.parents) !== null && _b !== void 0 ? _b : false,
    }), isIndeterminate = _d.isIndeterminate, isChecked = _d.isChecked;
    if (rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
        return null;
    }
    var label = apiRef.current.getLocaleText(isChecked && !isIndeterminate ? 'checkboxSelectionUnselectRow' : 'checkboxSelectionSelectRow');
    return (<rootProps.slots.baseCheckbox tabIndex={tabIndex} checked={isChecked && !isIndeterminate} onChange={handleChange} className={classes.root} slotProps={{
            htmlInput: { 'aria-label': label, name: 'select_row' },
        }} onKeyDown={handleKeyDown} indeterminate={isIndeterminate} disabled={!isSelectable} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.baseCheckbox} {...other} ref={ref}/>);
});
exports.GridCellCheckboxForwardRef = GridCellCheckboxForwardRef;
GridCellCheckboxForwardRef.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * GridApi that let you manipulate the grid.
     */
    api: prop_types_1.default.object.isRequired,
    /**
     * The mode of the cell.
     */
    cellMode: prop_types_1.default.oneOf(['edit', 'view']).isRequired,
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: prop_types_1.default.object.isRequired,
    /**
     * The column field of the cell that triggered the event.
     */
    field: prop_types_1.default.string.isRequired,
    /**
     * A ref allowing to set imperative focus.
     * It can be passed to the element that should receive focus.
     * @ignore - do not document.
     */
    focusElementRef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            current: prop_types_1.default.shape({
                focus: prop_types_1.default.func.isRequired,
            }),
        }),
    ]),
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: prop_types_1.default.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: prop_types_1.default.bool.isRequired,
    /**
     * The grid row id.
     */
    id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    /**
     * If true, the cell is editable.
     */
    isEditable: prop_types_1.default.bool,
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: prop_types_1.default.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: prop_types_1.default.object.isRequired,
    /**
     * the tabIndex value.
     */
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: prop_types_1.default.any,
};
exports.GridCellCheckboxRenderer = GridCellCheckboxForwardRef;
