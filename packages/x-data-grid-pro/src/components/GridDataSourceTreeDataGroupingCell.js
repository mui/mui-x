"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDataSourceTreeDataGroupingCell = GridDataSourceTreeDataGroupingCell;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var gridDataSourceSelector_1 = require("../hooks/features/dataSource/gridDataSourceSelector");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['treeDataGroupingCell'],
        toggle: ['treeDataGroupingCellToggle'],
        loadingContainer: ['treeDataGroupingCellLoadingContainer'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCellIcon(props) {
    var _a, _b;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var rowNode = props.rowNode, id = props.id, field = props.field, descendantCount = props.descendantCount;
    var isDataLoading = (0, x_data_grid_1.useGridSelector)(apiRef, gridDataSourceSelector_1.gridDataSourceLoadingIdSelector, id);
    var error = (0, x_data_grid_1.useGridSelector)(apiRef, gridDataSourceSelector_1.gridDataSourceErrorSelector, id);
    var handleClick = function (event) {
        if (!rowNode.childrenExpanded) {
            // always fetch/get from cache the children when the node is expanded
            apiRef.current.dataSource.fetchRows(id);
        }
        else {
            // Collapse the node and remove child rows from the grid
            apiRef.current.setRowChildrenExpansion(id, false);
            apiRef.current.removeChildrenRows(id);
        }
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation(); // TODO remove event.stopPropagation
    };
    var Icon = rowNode.childrenExpanded
        ? rootProps.slots.treeDataCollapseIcon
        : rootProps.slots.treeDataExpandIcon;
    if (isDataLoading) {
        return (<div className={classes.loadingContainer}>
        <rootProps.slots.baseCircularProgress size="1rem" color="inherit"/>
      </div>);
    }
    return descendantCount === -1 || descendantCount > 0 ? (<rootProps.slots.baseIconButton size="small" onClick={handleClick} tabIndex={-1} aria-label={rowNode.childrenExpanded
            ? apiRef.current.getLocaleText('treeDataCollapse')
            : apiRef.current.getLocaleText('treeDataExpand')} {...(_a = rootProps === null || rootProps === void 0 ? void 0 : rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseIconButton}>
      <rootProps.slots.baseTooltip title={(_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : null}>
        <rootProps.slots.baseBadge variant="dot" color="error" invisible={!error}>
          <Icon fontSize="inherit"/>
        </rootProps.slots.baseBadge>
      </rootProps.slots.baseTooltip>
    </rootProps.slots.baseIconButton>) : null;
}
function GridDataSourceTreeDataGroupingCell(props) {
    var _a, _b, _c;
    var id = props.id, field = props.field, formattedValue = props.formattedValue, rowNode = props.rowNode, hideDescendantCount = props.hideDescendantCount, _d = props.offsetMultiplier, offsetMultiplier = _d === void 0 ? 2 : _d;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var row = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridRowSelector, id);
    var classes = useUtilityClasses(rootProps);
    var descendantCount = 0;
    if (row) {
        descendantCount = (_c = (_b = (_a = rootProps.dataSource) === null || _a === void 0 ? void 0 : _a.getChildrenCount) === null || _b === void 0 ? void 0 : _b.call(_a, row)) !== null && _c !== void 0 ? _c : 0;
    }
    return (<div className={classes.root} style={{ marginLeft: internals_1.vars.spacing(rowNode.depth * offsetMultiplier) }}>
      <div className={classes.toggle}>
        <GridTreeDataGroupingCellIcon id={id} field={field} rowNode={rowNode} row={row} descendantCount={descendantCount}/>
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && descendantCount > 0 ? " (".concat(descendantCount, ")") : ''}
      </span>
    </div>);
}
