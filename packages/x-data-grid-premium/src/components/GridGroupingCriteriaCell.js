import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid/internals';
import { useGridSelector, gridFilteredDescendantCountLookupSelector, getDataGridUtilityClass, gridRowMaximumTreeDepthSelector, } from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridPivotActiveSelector } from '../hooks/features/pivoting/gridPivotingSelectors';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['groupingCriteriaCell'],
        toggle: ['groupingCriteriaCellToggle'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
export function GridGroupingCriteriaCell(props) {
    const { id, field, rowNode, hideDescendantCount, formattedValue } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const filteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
    const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
    const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
    const maxTreeDepth = gridRowMaximumTreeDepthSelector(apiRef);
    const shouldShowToggleContainer = !pivotActive || maxTreeDepth > 2;
    const shouldShowToggleButton = !pivotActive || rowNode.depth < maxTreeDepth - 2;
    const Icon = rowNode.childrenExpanded
        ? rootProps.slots.groupingCriteriaCollapseIcon
        : rootProps.slots.groupingCriteriaExpandIcon;
    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            // We call event.stopPropagation to avoid unfolding the row and also scrolling to bottom
            // TODO: Remove and add a check inside useGridKeyboardNavigation
            event.stopPropagation();
        }
        apiRef.current.publishEvent('cellKeyDown', props, event);
    };
    const handleClick = (event) => {
        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation();
    };
    let cellContent;
    const colDef = apiRef.current.getColumn(rowNode.groupingField);
    if (typeof colDef.renderCell === 'function') {
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
                : `calc(var(--DataGrid-cellOffsetMultiplier) * ${rowNode.depth} * ${vars.spacing(1)})`,
        }, children: [shouldShowToggleContainer ? (_jsx("div", { className: classes.toggle, children: shouldShowToggleButton && filteredDescendantCount > 0 && (_jsx(rootProps.slots.baseIconButton, { size: "small", onClick: handleClick, onKeyDown: handleKeyDown, tabIndex: -1, "aria-label": rowNode.childrenExpanded
                        ? apiRef.current.getLocaleText('treeDataCollapse')
                        : apiRef.current.getLocaleText('treeDataExpand'), ...rootProps.slotProps?.baseIconButton, children: _jsx(Icon, { fontSize: "inherit" }) })) })) : null, cellContent, !hideDescendantCount && filteredDescendantCount > 0 ? (_jsxs("span", { style: { whiteSpace: 'pre' }, children: [" (", filteredDescendantCount, ")"] })) : null] }));
}
