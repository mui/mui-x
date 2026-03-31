'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { computeOffsetLeft } from '@mui/x-virtualizer';
import { useGridSelector } from '../../utils';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridEvent } from '../../utils/useGridEvent';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { gridColumnsTotalWidthSelector, gridGroupHeaderHeightSelector, gridHasFillerSelector, gridHeaderHeightSelector, gridVerticalScrollbarWidthSelector, } from '../dimensions/gridDimensionsSelectors';
import { gridRenderContextColumnsSelector } from '../virtualization';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { gridColumnPositionsSelector, gridVisiblePinnedColumnDefinitionsSelector, gridColumnLookupSelector, } from '../columns';
import { gridColumnGroupsUnwrappedModelSelector } from '../columnGrouping/gridColumnGroupsSelector';
import { GridScrollbarFillerCell as ScrollbarFiller } from '../../../components/GridScrollbarFillerCell';
import { getPinnedCellOffset } from '../../../internals/utils/getPinnedCellOffset';
import { GridColumnHeaderSeparatorSides } from '../../../components/columnHeaders/GridColumnHeaderSeparator';
import { gridClasses } from '../../../constants/gridClasses';
import { shouldCellShowLeftBorder, shouldCellShowRightBorder, } from '../../../utils/cellBorderUtils';
import { PinnedColumnPosition } from '../../../internals/constants';
export const GridColumnHeaderRow = styled('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderRow',
})({
    display: 'flex',
});
export const useGridColumnHeaders = (props) => {
    const { visibleColumns, sortColumnLookup, filterColumnLookup, columnHeaderTabIndexState, columnGroupHeaderTabIndexState, columnHeaderFocus, columnGroupHeaderFocus, headerGroupingMaxDepth, columnMenuState, columnVisibility, columnGroupsHeaderStructure, hasOtherElementInTabSequence, } = props;
    const [dragCol, setDragCol] = React.useState('');
    const [resizeCol, setResizeCol] = React.useState('');
    const apiRef = useGridPrivateApiContext();
    const rootProps = useGridRootProps();
    const columnGroupsModel = useGridSelector(apiRef, gridColumnGroupsUnwrappedModelSelector);
    const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
    const renderContext = useGridSelector(apiRef, gridRenderContextColumnsSelector);
    const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
    const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const offsetLeft = computeOffsetLeft(columnPositions, renderContext, pinnedColumns.left.length);
    const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
    const gridHasFiller = useGridSelector(apiRef, gridHasFillerSelector);
    const headerHeight = useGridSelector(apiRef, gridHeaderHeightSelector);
    const groupHeaderHeight = useGridSelector(apiRef, gridGroupHeaderHeightSelector);
    const scrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
    const handleColumnResizeStart = React.useCallback((params) => setResizeCol(params.field), []);
    const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
    const handleColumnReorderStart = React.useCallback((params) => setDragCol(params.field), []);
    const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);
    const leftRenderContext = React.useMemo(() => {
        return pinnedColumns.left.length
            ? {
                firstColumnIndex: 0,
                lastColumnIndex: pinnedColumns.left.length,
            }
            : null;
    }, [pinnedColumns.left.length]);
    const rightRenderContext = React.useMemo(() => {
        return pinnedColumns.right.length
            ? {
                firstColumnIndex: visibleColumns.length - pinnedColumns.right.length,
                lastColumnIndex: visibleColumns.length,
            }
            : null;
    }, [pinnedColumns.right.length, visibleColumns.length]);
    useGridEvent(apiRef, 'columnResizeStart', handleColumnResizeStart);
    useGridEvent(apiRef, 'columnResizeStop', handleColumnResizeStop);
    useGridEvent(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
    useGridEvent(apiRef, 'columnHeaderDragEndNative', handleColumnReorderStop);
    // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
    const getColumnsToRender = (params) => {
        const { renderContext: currentContext = renderContext } = params || {};
        const firstColumnToRender = currentContext.firstColumnIndex;
        // HACK: renderContext ins't always synchronized, this should be handled properly.
        const lastColumnToRender = Math.min(currentContext.lastColumnIndex, visibleColumns.length);
        const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
        return {
            renderedColumns,
            firstColumnToRender,
            lastColumnToRender,
        };
    };
    const getFillers = (params, children, leftOverflow, borderBottom = false) => {
        const isPinnedRight = params?.position === PinnedColumnPosition.RIGHT;
        const isNotPinned = params?.position === undefined;
        const hasScrollbarFiller = (pinnedColumns.right.length > 0 && isPinnedRight) ||
            (pinnedColumns.right.length === 0 && isNotPinned);
        const leftOffsetWidth = offsetLeft - leftOverflow;
        return (_jsxs(React.Fragment, { children: [isNotPinned && _jsx("div", { role: "presentation", style: { width: leftOffsetWidth } }), children, isNotPinned && (_jsx("div", { role: "presentation", className: clsx(gridClasses.filler, borderBottom && gridClasses['filler--borderBottom']) })), hasScrollbarFiller && _jsx(ScrollbarFiller, { pinnedRight: isPinnedRight })] }));
    };
    const getColumnHeaders = (params, other = {}) => {
        const { renderedColumns, firstColumnToRender } = getColumnsToRender(params);
        const columns = [];
        for (let i = 0; i < renderedColumns.length; i += 1) {
            const colDef = renderedColumns[i];
            const columnIndex = firstColumnToRender + i;
            const isFirstColumn = columnIndex === 0;
            const tabIndex = (columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field) ||
                (isFirstColumn && !hasOtherElementInTabSequence)
                ? 0
                : -1;
            const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
            const open = columnMenuState.open && columnMenuState.field === colDef.field;
            const pinnedPosition = params?.position;
            const pinnedOffset = getPinnedCellOffset(pinnedPosition, colDef.computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            const siblingWithBorderingSeparator = pinnedPosition === PinnedColumnPosition.RIGHT
                ? renderedColumns[i - 1]
                : renderedColumns[i + 1];
            const isSiblingFocused = siblingWithBorderingSeparator
                ? columnHeaderFocus !== null &&
                    columnHeaderFocus.field === siblingWithBorderingSeparator.field
                : false;
            const indexInSection = i;
            const sectionLength = renderedColumns.length;
            const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, indexInSection, rootProps.showColumnVerticalBorder, rootProps.pinnedColumnsSectionSeparator);
            const showRightBorder = shouldCellShowRightBorder(pinnedPosition, indexInSection, sectionLength, rootProps.showColumnVerticalBorder, gridHasFiller, rootProps.pinnedColumnsSectionSeparator);
            columns.push(_jsx(GridColumnHeaderItem, { ...sortColumnLookup[colDef.field], columnMenuOpen: open, filterItemsCounter: filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length, headerHeight: headerHeight, isDragging: colDef.field === dragCol, colDef: colDef, colIndex: columnIndex, isResizing: resizeCol === colDef.field, isLast: columnIndex === columnPositions.length - 1, hasFocus: hasFocus, tabIndex: tabIndex, pinnedPosition: pinnedPosition, pinnedOffset: pinnedOffset, isSiblingFocused: isSiblingFocused, showLeftBorder: showLeftBorder, showRightBorder: showRightBorder, ...other }, colDef.field));
        }
        return getFillers(params, columns, 0);
    };
    const getColumnHeadersRow = () => {
        return (_jsxs(GridColumnHeaderRow, { role: "row", "aria-rowindex": headerGroupingMaxDepth + 1, ownerState: rootProps, className: gridClasses['row--borderBottom'], style: { height: headerHeight }, children: [leftRenderContext &&
                    getColumnHeaders({
                        position: PinnedColumnPosition.LEFT,
                        renderContext: leftRenderContext,
                    }, { disableReorder: true }), getColumnHeaders({
                    renderContext,
                }), rightRenderContext &&
                    getColumnHeaders({
                        position: PinnedColumnPosition.RIGHT,
                        renderContext: rightRenderContext,
                    }, {
                        disableReorder: true,
                        separatorSide: GridColumnHeaderSeparatorSides.Left,
                    })] }));
    };
    const getColumnGroupHeaders = ({ depth, params, }) => {
        const columnsToRender = getColumnsToRender(params);
        if (columnsToRender.renderedColumns.length === 0) {
            return null;
        }
        const { firstColumnToRender, lastColumnToRender } = columnsToRender;
        const rowStructure = columnGroupsHeaderStructure[depth];
        const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
        const firstGroupToRender = columnGroupsModel[firstColumnFieldToRender]?.[depth] ?? null;
        const firstGroupIndex = rowStructure.findIndex(({ groupId, columnFields }) => groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender));
        const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
        const lastGroupToRender = columnGroupsModel[lastColumnFieldToRender]?.[depth] ?? null;
        const lastGroupIndex = rowStructure.findIndex(({ groupId, columnFields }) => groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender));
        const visibleColumnGroupHeader = rowStructure
            .slice(firstGroupIndex, lastGroupIndex + 1)
            .map((groupStructure) => {
            return {
                ...groupStructure,
                columnFields: groupStructure.columnFields.filter((field) => columnVisibility[field] !== false),
            };
        })
            .filter((groupStructure) => groupStructure.columnFields.length > 0);
        const firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
        const hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
        const leftOverflow = hiddenGroupColumns.reduce((acc, field) => {
            const column = columnsLookup[field];
            return acc + (column.computedWidth ?? 0);
        }, 0);
        let columnIndex = firstColumnToRender;
        const children = visibleColumnGroupHeader.map(({ groupId, columnFields }, index) => {
            const hasFocus = columnGroupHeaderFocus !== null &&
                columnGroupHeaderFocus.depth === depth &&
                columnFields.includes(columnGroupHeaderFocus.field);
            const tabIndex = columnGroupHeaderTabIndexState !== null &&
                columnGroupHeaderTabIndexState.depth === depth &&
                columnFields.includes(columnGroupHeaderTabIndexState.field)
                ? 0
                : -1;
            const headerInfo = {
                groupId,
                width: columnFields.reduce((acc, field) => acc + columnsLookup[field].computedWidth, 0),
                fields: columnFields,
                colIndex: columnIndex,
                hasFocus,
                tabIndex,
            };
            const pinnedPosition = params.position;
            const pinnedOffset = getPinnedCellOffset(pinnedPosition, headerInfo.width, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            columnIndex += columnFields.length;
            let indexInSection = index;
            if (pinnedPosition === PinnedColumnPosition.LEFT) {
                // Group headers can expand to multiple columns, we need to adjust the index
                indexInSection = columnIndex - 1;
            }
            return (_jsx(GridColumnGroupHeader, { groupId: groupId, width: headerInfo.width, fields: headerInfo.fields, colIndex: headerInfo.colIndex, depth: depth, isLastColumn: index === visibleColumnGroupHeader.length - 1, maxDepth: headerGroupingMaxDepth, height: groupHeaderHeight, hasFocus: hasFocus, tabIndex: tabIndex, pinnedPosition: pinnedPosition, pinnedOffset: pinnedOffset, showLeftBorder: shouldCellShowLeftBorder(pinnedPosition, indexInSection, rootProps.showColumnVerticalBorder, rootProps.pinnedColumnsSectionSeparator), showRightBorder: shouldCellShowRightBorder(pinnedPosition, indexInSection, visibleColumnGroupHeader.length, rootProps.showColumnVerticalBorder, gridHasFiller, rootProps.pinnedColumnsSectionSeparator) }, index));
        });
        return getFillers(params, children, leftOverflow);
    };
    const getColumnGroupHeadersRows = () => {
        if (headerGroupingMaxDepth === 0) {
            return null;
        }
        const headerRows = [];
        for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
            headerRows.push(_jsxs(GridColumnHeaderRow, { role: "row", "aria-rowindex": depth + 1, ownerState: rootProps, style: { height: groupHeaderHeight }, children: [leftRenderContext &&
                        getColumnGroupHeaders({
                            depth,
                            params: {
                                position: PinnedColumnPosition.LEFT,
                                renderContext: leftRenderContext,
                                maxLastColumn: leftRenderContext.lastColumnIndex,
                            },
                        }), getColumnGroupHeaders({ depth, params: { renderContext } }), rightRenderContext &&
                        getColumnGroupHeaders({
                            depth,
                            params: {
                                position: PinnedColumnPosition.RIGHT,
                                renderContext: rightRenderContext,
                                maxLastColumn: rightRenderContext.lastColumnIndex,
                            },
                        })] }, depth));
        }
        return headerRows;
    };
    return {
        renderContext,
        leftRenderContext,
        rightRenderContext,
        pinnedColumns,
        visibleColumns,
        columnPositions,
        getFillers,
        getColumnHeadersRow,
        getColumnsToRender,
        getColumnGroupHeadersRows,
        getPinnedCellOffset,
        isDragging: !!dragCol,
        getInnerProps: () => ({
            role: 'rowgroup',
        }),
    };
};
