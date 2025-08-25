"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDetailPanelToggleCell = GridDetailPanelToggleCell;
var React = require("react");
var prop_types_1 = require("prop-types");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var gridDetailPanelSelector_1 = require("../hooks/features/detailPanel/gridDetailPanelSelector");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, isExpanded = ownerState.isExpanded;
    var slots = {
        root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
var isExpandedSelector = (0, internals_1.createSelector)(gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector, function (expandedRowIds, rowId) {
    return expandedRowIds.has(rowId);
});
function GridDetailPanelToggleCell(props) {
    var _a;
    var id = props.id, row = props.row, api = props.api;
    var rowId = api.getRowId(row);
    var isExpanded = (0, x_data_grid_1.useGridSelector)({ current: api }, isExpandedSelector, rowId);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = { classes: rootProps.classes, isExpanded: isExpanded };
    var classes = useUtilityClasses(ownerState);
    var contentCache = (0, x_data_grid_1.useGridSelector)(apiRef, gridDetailPanelSelector_1.gridDetailPanelExpandedRowsContentCacheSelector);
    var hasContent = React.isValidElement(contentCache[id]);
    var Icon = isExpanded
        ? rootProps.slots.detailPanelCollapseIcon
        : rootProps.slots.detailPanelExpandIcon;
    return (<rootProps.slots.baseIconButton size="small" tabIndex={-1} disabled={!hasContent} className={classes.root} aria-expanded={isExpanded} aria-label={isExpanded
            ? apiRef.current.getLocaleText('collapseDetailPanel')
            : apiRef.current.getLocaleText('expandDetailPanel')} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
      <Icon fontSize="inherit"/>
    </rootProps.slots.baseIconButton>);
}
GridDetailPanelToggleCell.propTypes = {
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
