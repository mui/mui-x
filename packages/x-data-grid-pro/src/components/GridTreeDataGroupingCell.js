import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useGridSelector, gridFilteredDescendantCountLookupSelector, getDataGridUtilityClass, } from '@mui/x-data-grid';
import { vars } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    const slots = {
        root: ['treeDataGroupingCell'],
        toggle: ['treeDataGroupingCellToggle'],
    };
    return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridTreeDataGroupingCell(props) {
    const { id, field, formattedValue, rowNode, hideDescendantCount, offsetMultiplier = 2 } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const classes = useUtilityClasses(rootProps);
    const filteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
    const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
    const Icon = rowNode.childrenExpanded
        ? rootProps.slots.treeDataCollapseIcon
        : rootProps.slots.treeDataExpandIcon;
    const handleClick = (event) => {
        apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
        apiRef.current.setCellFocus(id, field);
        event.stopPropagation(); // TODO remove event.stopPropagation
    };
    return (_jsxs("div", { className: classes.root, style: { marginLeft: vars.spacing(rowNode.depth * offsetMultiplier) }, children: [_jsx("div", { className: classes.toggle, children: filteredDescendantCount > 0 && (_jsx(rootProps.slots.baseIconButton, { size: "small", onClick: handleClick, tabIndex: -1, "aria-label": rowNode.childrenExpanded
                        ? apiRef.current.getLocaleText('treeDataCollapse')
                        : apiRef.current.getLocaleText('treeDataExpand'), ...rootProps?.slotProps?.baseIconButton, children: _jsx(Icon, { fontSize: "inherit" }) })) }), _jsxs("span", { children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && filteredDescendantCount > 0 ? ` (${filteredDescendantCount})` : ''] })] }));
}
GridTreeDataGroupingCell.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * GridApi that let you manipulate the grid.
     */
    api: PropTypes.object.isRequired,
    /**
     * The mode of the cell.
     */
    cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The column field of the cell that triggered the event.
     */
    field: PropTypes.string.isRequired,
    /**
     * The cell value formatted with the column valueFormatter.
     */
    formattedValue: PropTypes.any,
    /**
     * If true, the cell is the active element.
     */
    hasFocus: PropTypes.bool.isRequired,
    hideDescendantCount: PropTypes.bool,
    /**
     * The grid row id.
     */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    /**
     * If true, the cell is editable.
     */
    isEditable: PropTypes.bool,
    /**
     * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
     * @default 2
     */
    offsetMultiplier: PropTypes.number,
    /**
     * The row model of the row that the current cell belongs to.
     */
    row: PropTypes.any.isRequired,
    /**
     * The node of the row that the current cell belongs to.
     */
    rowNode: PropTypes.object.isRequired,
    /**
     * the tabIndex value.
     */
    tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.any,
};
export { GridTreeDataGroupingCell };
