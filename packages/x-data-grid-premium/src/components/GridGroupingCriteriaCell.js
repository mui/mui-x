"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridGroupingCriteriaCell = GridGroupingCriteriaCell;
var React = require("react");
var composeClasses_1 = require("@mui/utils/composeClasses");
var internals_1 = require("@mui/x-data-grid/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var gridPivotingSelectors_1 = require("../hooks/features/pivoting/gridPivotingSelectors");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['groupingCriteriaCell'],
        toggle: ['groupingCriteriaCellToggle'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
function GridGroupingCriteriaCell(props) {
    var _a, _b;
    var id = props.id, field = props.field, rowNode = props.rowNode, hideDescendantCount = props.hideDescendantCount, formattedValue = props.formattedValue;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var ownerState = { classes: rootProps.classes };
    var classes = useUtilityClasses(ownerState);
    var filteredDescendantCountLookup = (0, x_data_grid_pro_1.useGridSelector)(apiRef, x_data_grid_pro_1.gridFilteredDescendantCountLookupSelector);
    var filteredDescendantCount = (_a = filteredDescendantCountLookup[rowNode.id]) !== null && _a !== void 0 ? _a : 0;
    var pivotActive = (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotActiveSelector);
    var maxTreeDepth = (0, x_data_grid_pro_1.gridRowMaximumTreeDepthSelector)(apiRef);
    var shouldShowToggleContainer = !pivotActive || maxTreeDepth > 2;
    var shouldShowToggleButton = !pivotActive || rowNode.depth < maxTreeDepth - 2;
    var Icon = rowNode.childrenExpanded
        ? rootProps.slots.groupingCriteriaCollapseIcon
        : rootProps.slots.groupingCriteriaExpandIcon;
    var handleKeyDown = function (event) {
        if (event.key === ' ') {
            // We call event.stopPropagation to avoid unfolding the row and also scrolling to bottom
            // TODO: Remove and add a check inside useGridKeyboardNavigation
            event.stopPropagation();
        }
        apiRef.current.publishEvent('cellKeyDown', props, event);
    };
    var handleClick = function (event) {
        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation();
    };
    var cellContent;
    var colDef = apiRef.current.getColumn(rowNode.groupingField);
    if (typeof colDef.renderCell === 'function') {
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
                : "calc(var(--DataGrid-cellOffsetMultiplier) * ".concat(rowNode.depth, " * ").concat(internals_1.vars.spacing(1), ")"),
        }}>
      {shouldShowToggleContainer ? (<div className={classes.toggle}>
          {shouldShowToggleButton && filteredDescendantCount > 0 && (<rootProps.slots.baseIconButton size="small" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={-1} aria-label={rowNode.childrenExpanded
                    ? apiRef.current.getLocaleText('treeDataCollapse')
                    : apiRef.current.getLocaleText('treeDataExpand')} {...(_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b.baseIconButton}>
              <Icon fontSize="inherit"/>
            </rootProps.slots.baseIconButton>)}
        </div>) : null}
      {cellContent}
      {!hideDescendantCount && filteredDescendantCount > 0 ? (<span style={{ whiteSpace: 'pre' }}> ({filteredDescendantCount})</span>) : null}
    </div>);
}
