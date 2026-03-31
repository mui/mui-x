import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../../hooks/features/sorting/gridSortingSelector';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
function GridColumnMenuSortItem(props) {
    const { colDef, onClick } = props;
    const apiRef = useGridApiContext();
    const sortModel = useGridSelector(apiRef, gridSortModelSelector);
    const rootProps = useGridRootProps();
    const sortDirection = React.useMemo(() => {
        if (!colDef) {
            return null;
        }
        const sortItem = sortModel.find((item) => item.field === colDef.field);
        return sortItem?.sort;
    }, [colDef, sortModel]);
    const sortingOrder = colDef.sortingOrder ?? rootProps.sortingOrder;
    const onSortMenuItemClick = React.useCallback((event) => {
        onClick(event);
        const direction = event.currentTarget.getAttribute('data-value') || null;
        const allowMultipleSorting = rootProps.multipleColumnsSortingMode === 'always';
        apiRef.current.sortColumn(colDef.field, (direction === sortDirection ? null : direction), allowMultipleSorting);
    }, [apiRef, colDef, onClick, sortDirection, rootProps.multipleColumnsSortingMode]);
    if (rootProps.disableColumnSorting ||
        !colDef ||
        !colDef.sortable ||
        !sortingOrder.some((item) => !!item)) {
        return null;
    }
    const getLabel = (key) => {
        const label = apiRef.current.getLocaleText(key);
        return typeof label === 'function' ? label(colDef) : label;
    };
    return (_jsxs(React.Fragment, { children: [sortingOrder.includes('asc') && sortDirection !== 'asc' ? (_jsx(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, "data-value": "asc", iconStart: _jsx(rootProps.slots.columnMenuSortAscendingIcon, { fontSize: "small" }), children: getLabel('columnMenuSortAsc') })) : null, sortingOrder.includes('desc') && sortDirection !== 'desc' ? (_jsx(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, "data-value": "desc", iconStart: _jsx(rootProps.slots.columnMenuSortDescendingIcon, { fontSize: "small" }), children: getLabel('columnMenuSortDesc') })) : null, sortingOrder.includes(null) && sortDirection != null ? (_jsx(rootProps.slots.baseMenuItem, { onClick: onSortMenuItemClick, iconStart: rootProps.slots.columnMenuUnsortIcon ? (_jsx(rootProps.slots.columnMenuUnsortIcon, { fontSize: "small" })) : (_jsx("span", {})), children: apiRef.current.getLocaleText('columnMenuUnsort') })) : null] }));
}
GridColumnMenuSortItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
export { GridColumnMenuSortItem };
