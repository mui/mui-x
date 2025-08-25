"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDataSourceGroupingCriteriaCell = GridDataSourceGroupingCriteriaCell;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['groupingCriteriaCell'],
        toggle: ['groupingCriteriaCellToggle'],
        loadingContainer: ['groupingCriteriaCellLoadingContainer'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
function GridGroupingCriteriaCellIcon(props) {
    var _a, _b;
    var apiRef = (0, internals_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var rowNode = props.rowNode, id = props.id, field = props.field, descendantCount = props.descendantCount;
    var isDataLoading = (0, x_data_grid_pro_1.useGridSelector)(apiRef, internals_1.gridDataSourceLoadingIdSelector, id);
    var error = (0, x_data_grid_pro_1.useGridSelector)(apiRef, internals_1.gridDataSourceErrorSelector, id);
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
        event.stopPropagation();
    };
    var Icon = rowNode.childrenExpanded
        ? rootProps.slots.groupingCriteriaCollapseIcon
        : rootProps.slots.groupingCriteriaExpandIcon;
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
function GridDataSourceGroupingCriteriaCell(props) {
    var _a, _b, _c;
    var id = props.id, field = props.field, rowNode = props.rowNode, hideDescendantCount = props.hideDescendantCount, formattedValue = props.formattedValue;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var row = (0, x_data_grid_pro_1.useGridSelector)(apiRef, internals_1.gridRowSelector, id);
    var classes = useUtilityClasses(rootProps);
    var descendantCount = 0;
    if (row) {
        descendantCount = (_c = (_b = (_a = rootProps.dataSource) === null || _a === void 0 ? void 0 : _a.getChildrenCount) === null || _b === void 0 ? void 0 : _b.call(_a, row)) !== null && _c !== void 0 ? _c : 0;
    }
    var cellContent;
    var colDef = apiRef.current.getColumn(rowNode.groupingField);
    if (typeof (colDef === null || colDef === void 0 ? void 0 : colDef.renderCell) === 'function') {
        cellContent = colDef.renderCell(props);
    }
    else if (typeof formattedValue !== 'undefined') {
        cellContent = <span>{formattedValue}</span>;
    }
    else {
        cellContent = <span>{rowNode.groupingKey}</span>;
    }
    return (<div className={classes.root} style={{
            marginLeft: rootProps.rowGroupingColumnMode === 'multiple'
                ? 0
                : "calc(var(--DataGrid-cellOffsetMultiplier) * ".concat(internals_1.vars.spacing(rowNode.depth), ")"),
        }}>
      <div className={classes.toggle}>
        <GridGroupingCriteriaCellIcon id={id} field={field} rowNode={rowNode} row={row} descendantCount={descendantCount}/>
      </div>
      {cellContent}
      {!hideDescendantCount && descendantCount > 0 ? (<span style={{ whiteSpace: 'pre' }}> ({descendantCount})</span>) : null}
    </div>);
}
