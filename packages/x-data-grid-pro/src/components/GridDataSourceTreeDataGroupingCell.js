import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, useGridSelector, } from '@mui/x-data-grid';
import { vars, gridRowSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { gridDataSourceErrorSelector, gridDataSourceLoadingIdSelector, } from '../hooks/features/dataSource/gridDataSourceSelector';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['treeDataGroupingCell'],
        toggle: ['treeDataGroupingCellToggle'],
        loadingContainer: ['treeDataGroupingCellLoadingContainer'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCellIcon(props) {
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
        event.stopPropagation(); // TODO remove event.stopPropagation
    };
    const Icon = rowNode.childrenExpanded
        ? rootProps.slots.treeDataCollapseIcon
        : rootProps.slots.treeDataExpandIcon;
    if (isDataLoading) {
        return (_jsx("div", { className: classes.loadingContainer, children: _jsx(rootProps.slots.baseCircularProgress, { size: "1rem", color: "inherit" }) }));
    }
    return descendantCount === -1 || descendantCount > 0 ? (_jsx(rootProps.slots.baseIconButton, { size: "small", onClick: handleClick, tabIndex: -1, "aria-label": rowNode.childrenExpanded
            ? apiRef.current.getLocaleText('treeDataCollapse')
            : apiRef.current.getLocaleText('treeDataExpand'), ...rootProps?.slotProps?.baseIconButton, children: _jsx(rootProps.slots.baseTooltip, { title: error?.message ?? null, children: _jsx(rootProps.slots.baseBadge, { variant: "dot", color: "error", invisible: !error, children: _jsx(Icon, { fontSize: "inherit" }) }) }) })) : null;
}
export function GridDataSourceTreeDataGroupingCell(props) {
    const { id, field, formattedValue, rowNode, hideDescendantCount, offsetMultiplier = 2 } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridPrivateApiContext();
    const row = useGridSelector(apiRef, gridRowSelector, id);
    const classes = useUtilityClasses(rootProps);
    let descendantCount = 0;
    if (row) {
        descendantCount = rootProps.dataSource?.getChildrenCount?.(row) ?? 0;
    }
    return (_jsxs("div", { className: classes.root, style: { marginLeft: vars.spacing(rowNode.depth * offsetMultiplier) }, children: [_jsx("div", { className: classes.toggle, children: _jsx(GridTreeDataGroupingCellIcon, { id: id, field: field, rowNode: rowNode, row: row, descendantCount: descendantCount }) }), _jsxs("span", { children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : ''] })] }));
}
