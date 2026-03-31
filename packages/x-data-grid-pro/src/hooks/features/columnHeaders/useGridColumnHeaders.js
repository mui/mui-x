'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { gridFocusColumnHeaderFilterSelector, useGridSelector, gridFilterModelSelector, gridTabIndexColumnHeaderFilterSelector, getDataGridUtilityClass, } from '@mui/x-data-grid';
import { gridColumnsTotalWidthSelector, gridHasFillerSelector, gridHeaderFilterHeightSelector, gridVerticalScrollbarWidthSelector, useGridColumnHeaders as useGridColumnHeadersCommunity, useGridPrivateApiContext, getGridFilter, GridColumnHeaderRow, shouldCellShowLeftBorder, shouldCellShowRightBorder, PinnedColumnPosition, } from '@mui/x-data-grid/internals';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../utils/useGridRootProps';
const useUtilityClasses = (ownerState) => {
    const { classes } = ownerState;
    return React.useMemo(() => {
        const slots = {
            headerFilterRow: ['headerFilterRow'],
        };
        return composeClasses(slots, getDataGridUtilityClass, classes);
    }, [classes]);
};
export const useGridColumnHeadersPro = (props) => {
    const apiRef = useGridPrivateApiContext();
    const { headerGroupingMaxDepth, hasOtherElementInTabSequence } = props;
    const columnHeaderFilterTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderFilterSelector);
    const { getColumnsToRender, getPinnedCellOffset, renderContext, leftRenderContext, rightRenderContext, pinnedColumns, visibleColumns, columnPositions, ...otherProps } = useGridColumnHeadersCommunity({
        ...props,
        hasOtherElementInTabSequence: hasOtherElementInTabSequence || columnHeaderFilterTabIndexState !== null,
    });
    const headerFiltersRef = React.useRef(null);
    apiRef.current.register('private', {
        headerFiltersElementRef: headerFiltersRef,
    });
    const headerFilterMenuRef = React.useRef(null);
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);
    const disableHeaderFiltering = !rootProps.headerFilters;
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
    const gridHasFiller = useGridSelector(apiRef, gridHasFillerSelector);
    const headerFilterHeight = useGridSelector(apiRef, gridHeaderFilterHeightSelector);
    const scrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
    const columnHeaderFilterFocus = useGridSelector(apiRef, gridFocusColumnHeaderFilterSelector);
    const filterItemsCache = React.useRef(Object.create(null)).current;
    const getFilterItem = React.useCallback((colDef) => {
        const filterModelItem = filterModel?.items.find((it) => it.field === colDef.field && it.operator !== 'isAnyOf');
        if (filterModelItem != null) {
            // there's a valid `filterModelItem` for this column
            return filterModelItem;
        }
        const defaultCachedItem = filterItemsCache[colDef.field];
        if (defaultCachedItem != null) {
            // there's a cached `defaultItem` for this column
            return defaultCachedItem;
        }
        // there's no cached `defaultItem` for this column, let's generate one and cache it
        const defaultItem = getGridFilter(colDef);
        filterItemsCache[colDef.field] = defaultItem;
        return defaultItem;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterModel]);
    const getColumnFilters = (params) => {
        const { renderedColumns, firstColumnToRender } = getColumnsToRender(params);
        const filters = [];
        for (let i = 0; i < renderedColumns.length; i += 1) {
            const colDef = renderedColumns[i];
            const columnIndex = firstColumnToRender + i;
            const hasFocus = columnHeaderFilterFocus?.field === colDef.field;
            const isFirstColumn = columnIndex === 0;
            const tabIndexField = columnHeaderFilterTabIndexState?.field;
            const tabIndex = tabIndexField === colDef.field || (isFirstColumn && !props.hasOtherElementInTabSequence)
                ? 0
                : -1;
            const headerClassName = typeof colDef.headerClassName === 'function'
                ? colDef.headerClassName({ field: colDef.field, colDef })
                : colDef.headerClassName;
            const item = getFilterItem(colDef);
            const pinnedPosition = params?.position;
            const pinnedOffset = getPinnedCellOffset(pinnedPosition, colDef.computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            const indexInSection = i;
            const sectionLength = renderedColumns.length;
            const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection, rootProps.showColumnVerticalBorder, rootProps.pinnedColumnsSectionSeparator);
            const showRightBorder = shouldCellShowRightBorder(pinnedPosition, indexInSection, sectionLength, rootProps.showColumnVerticalBorder, gridHasFiller, rootProps.pinnedColumnsSectionSeparator);
            filters.push(_jsx(rootProps.slots.headerFilterCell, { colIndex: columnIndex, height: headerFilterHeight, width: colDef.computedWidth, colDef: colDef, hasFocus: hasFocus, tabIndex: tabIndex, headerFilterMenuRef: headerFilterMenuRef, headerClassName: headerClassName, "data-field": colDef.field, item: item, pinnedPosition: pinnedPosition, pinnedOffset: pinnedOffset, showLeftBorder: showLeftBorder, showRightBorder: showRightBorder, ...rootProps.slotProps?.headerFilterCell }, `${colDef.field}-filter`));
        }
        return otherProps.getFillers(params, filters, 0, true);
    };
    const getColumnFiltersRow = () => {
        if (disableHeaderFiltering) {
            return null;
        }
        return (_jsxs(GridColumnHeaderRow, { ref: headerFiltersRef, className: classes.headerFilterRow, role: "row", "aria-rowindex": headerGroupingMaxDepth + 2, ownerState: rootProps, children: [leftRenderContext &&
                    getColumnFilters({
                        position: PinnedColumnPosition.LEFT,
                        renderContext: leftRenderContext,
                        maxLastColumn: leftRenderContext.lastColumnIndex,
                    }), getColumnFilters({
                    renderContext,
                    maxLastColumn: visibleColumns.length - pinnedColumns.right.length,
                }), rightRenderContext &&
                    getColumnFilters({
                        position: PinnedColumnPosition.RIGHT,
                        renderContext: rightRenderContext,
                        maxLastColumn: rightRenderContext.lastColumnIndex,
                    })] }));
    };
    return {
        ...otherProps,
        getColumnFiltersRow,
    };
};
