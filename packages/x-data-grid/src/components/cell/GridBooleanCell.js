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
exports.renderBooleanCell = exports.GridBooleanCell = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridRowsSelector_1 = require("../../hooks/features/rows/gridRowsSelector");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var gridRowsUtils_1 = require("../../hooks/features/rows/gridRowsUtils");
var constants_1 = require("../../internals/constants");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['booleanCell'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridBooleanCellRaw(props) {
    var id = props.id, value = props.value, formattedValue = props.formattedValue, api = props.api, field = props.field, row = props.row, rowNode = props.rowNode, colDef = props.colDef, cellMode = props.cellMode, isEditable = props.isEditable, hasFocus = props.hasFocus, tabIndex = props.tabIndex, hideDescendantCount = props.hideDescendantCount, other = __rest(props, ["id", "value", "formattedValue", "api", "field", "row", "rowNode", "colDef", "cellMode", "isEditable", "hasFocus", "tabIndex", "hideDescendantCount"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var maxDepth = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridRowMaximumTreeDepthSelector);
    var isServerSideRowGroupingRow = 
    // @ts-expect-error - Access tree data prop
    maxDepth > 0 && rowNode.type === 'group' && rootProps.treeData === false;
    var Icon = React.useMemo(function () { return (value ? rootProps.slots.booleanCellTrueIcon : rootProps.slots.booleanCellFalseIcon); }, [rootProps.slots.booleanCellFalseIcon, rootProps.slots.booleanCellTrueIcon, value]);
    if (isServerSideRowGroupingRow && value === undefined) {
        return null;
    }
    return (<Icon fontSize="small" className={classes.root} titleAccess={apiRef.current.getLocaleText(value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel')} data-value={Boolean(value)} {...other}/>);
}
GridBooleanCellRaw.propTypes = {
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
    hideDescendantCount: prop_types_1.default.bool,
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
var GridBooleanCell = React.memo(GridBooleanCellRaw);
exports.GridBooleanCell = GridBooleanCell;
var renderBooleanCell = function (params) {
    if (params.field !== constants_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD &&
        (0, gridRowsUtils_1.isAutogeneratedRowNode)(params.rowNode)) {
        return '';
    }
    return <GridBooleanCell {...params}/>;
};
exports.renderBooleanCell = renderBooleanCell;
