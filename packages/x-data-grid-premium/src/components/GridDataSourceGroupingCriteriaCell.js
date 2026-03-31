import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useGridPrivateApiContext, gridDataSourceErrorSelector, gridDataSourceLoadingIdSelector, gridRowSelector, vars, gridPivotActiveSelector, } from '@mui/x-data-grid-pro/internals';
import { useGridSelector, getDataGridUtilityClass, } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridRowGroupingModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['groupingCriteriaCell'],
        toggle: ['groupingCriteriaCellToggle'],
        loadingContainer: ['groupingCriteriaCellLoadingContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridGroupingCriteriaCellIcon(props) {
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const { rowNode, id, field, descendantCount } = props;
    const isDataLoading = useGridSelector(apiRef, gridDataSourceLoadingIdSelector, id);
    const error = useGridSelector(apiRef, gridDataSourceErrorSelector, id);
    const handleClick = (event) => {
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
    const Icon = rowNode.childrenExpanded
        ? rootProps.slots.groupingCriteriaCollapseIcon
        : rootProps.slots.groupingCriteriaExpandIcon;
    if (isDataLoading) {
        return (_jsx("div", { className: classes.loadingContainer, children: _jsx(rootProps.slots.baseCircularProgress, { size: "1rem", color: "inherit" }) }));
    }
    return descendantCount === -1 || descendantCount > 0 ? (_jsx(rootProps.slots.baseIconButton, { size: "small", onClick: handleClick, tabIndex: -1, "aria-label": rowNode.childrenExpanded
            ? apiRef.current.getLocaleText('treeDataCollapse')
            : apiRef.current.getLocaleText('treeDataExpand'), ...rootProps?.slotProps?.baseIconButton, children: _jsx(rootProps.slots.baseTooltip, { title: error?.message ?? null, children: _jsx(rootProps.slots.baseBadge, { variant: "dot", color: "error", invisible: !error, children: _jsx(Icon, { fontSize: "inherit" }) }) }) })) : null;
}
export function GridDataSourceGroupingCriteriaCell(props) {
    const { id, field, rowNode, hideDescendantCount, formattedValue } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const row = useGridSelector(apiRef, gridRowSelector, id);
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const rowGroupingModelLength = useGridSelector(apiRef, gridRowGroupingModelSelector).length;
    const classes = useUtilityClasses(rootProps);
    const shouldShowToggleContainer = !pivotActive || rowGroupingModelLength > 1;
    // Do not allow expand/collapse the last grouping criteria cell when in pivot mode
    const shouldShowToggleButton = !pivotActive || rowNode.depth < rowGroupingModelLength - 1;
    let descendantCount = 0;
    if (row) {
        descendantCount = rootProps.dataSource?.getChildrenCount?.(row) ?? 0;
    }
    let cellContent;
    const colDef = apiRef.current.getColumn(rowNode.groupingField);
    if (typeof colDef?.renderCell === 'function') {
        cellContent = colDef.renderCell(props);
    }
    else if (typeof formattedValue !== 'undefined') {
        cellContent = _jsx("span", { children: formattedValue });
    }
    else {
        cellContent = _jsx("span", { children: rowNode.groupingKey });
    }
    return (_jsxs("div", { className: classes.root, style: {
            marginLeft: rootProps.rowGroupingColumnMode === 'multiple'
                ? 0
                : `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(rowNode.depth)})`,
        }, children: [shouldShowToggleContainer && (_jsx("div", { className: classes.toggle, children: shouldShowToggleButton && (_jsx(GridGroupingCriteriaCellIcon, { id: id, field: field, rowNode: rowNode, row: row, descendantCount: descendantCount })) })), cellContent, !hideDescendantCount && descendantCount > 0 ? (_jsxs("span", { style: { whiteSpace: 'pre' }, children: [" (", descendantCount, ")"] })) : null] }));
}
