"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridTreeDataGroupingCell = GridTreeDataGroupingCell;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['treeDataGroupingCell'],
        toggle: ['treeDataGroupingCellToggle'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCell(props) {
    var _a, _b;
    var id = props.id, field = props.field, formattedValue = props.formattedValue, rowNode = props.rowNode, hideDescendantCount = props.hideDescendantCount, _c = props.offsetMultiplier, offsetMultiplier = _c === void 0 ? 2 : _c;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var classes = useUtilityClasses(rootProps);
    var filteredDescendantCountLookup = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFilteredDescendantCountLookupSelector);
    var filteredDescendantCount = (_a = filteredDescendantCountLookup[rowNode.id]) !== null && _a !== void 0 ? _a : 0;
    var Icon = rowNode.childrenExpanded
        ? rootProps.slots.treeDataCollapseIcon
        : rootProps.slots.treeDataExpandIcon;
    var handleClick = function (event) {
        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation(); // TODO remove event.stopPropagation
    };
    return (<div className={classes.root} style={{ marginLeft: internals_1.vars.spacing(rowNode.depth * offsetMultiplier) }}>
      <div className={classes.toggle}>
        {filteredDescendantCount > 0 && (<rootProps.slots.baseIconButton size="small" onClick={handleClick} tabIndex={-1} aria-label={rowNode.childrenExpanded
                ? apiRef.current.getLocaleText('treeDataCollapse')
                : apiRef.current.getLocaleText('treeDataExpand')} {...(_b = rootProps === null || rootProps === void 0 ? void 0 : rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton}>
            <Icon fontSize="inherit"/>
          </rootProps.slots.baseIconButton>)}
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && filteredDescendantCount > 0 ? " (".concat(filteredDescendantCount, ")") : ''}
      </span>
    </div>);
}
GridTreeDataGroupingCell.propTypes = {
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
     * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
     * @default 2
     */
    offsetMultiplier: prop_types_1.default.number,
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
