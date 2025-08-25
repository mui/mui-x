"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnHeaders = exports.GridColumnHeaderRow = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var x_virtualizer_1 = require("@mui/x-virtualizer");
var utils_1 = require("../../utils");
var useGridRootProps_1 = require("../../utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../utils/useGridPrivateApiContext");
var useGridEvent_1 = require("../../utils/useGridEvent");
var GridColumnHeaderItem_1 = require("../../../components/columnHeaders/GridColumnHeaderItem");
var gridDimensionsSelectors_1 = require("../dimensions/gridDimensionsSelectors");
var virtualization_1 = require("../virtualization");
var GridColumnGroupHeader_1 = require("../../../components/columnHeaders/GridColumnGroupHeader");
var columns_1 = require("../columns");
var gridColumnGroupsSelector_1 = require("../columnGrouping/gridColumnGroupsSelector");
var GridScrollbarFillerCell_1 = require("../../../components/GridScrollbarFillerCell");
var getPinnedCellOffset_1 = require("../../../internals/utils/getPinnedCellOffset");
var GridColumnHeaderSeparator_1 = require("../../../components/columnHeaders/GridColumnHeaderSeparator");
var gridClasses_1 = require("../../../constants/gridClasses");
var cellBorderUtils_1 = require("../../../utils/cellBorderUtils");
var constants_1 = require("../../../internals/constants");
exports.GridColumnHeaderRow = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ColumnHeaderRow',
})({
    display: 'flex',
});
var useGridColumnHeaders = function (props) {
    var visibleColumns = props.visibleColumns, sortColumnLookup = props.sortColumnLookup, filterColumnLookup = props.filterColumnLookup, columnHeaderTabIndexState = props.columnHeaderTabIndexState, columnGroupHeaderTabIndexState = props.columnGroupHeaderTabIndexState, columnHeaderFocus = props.columnHeaderFocus, columnGroupHeaderFocus = props.columnGroupHeaderFocus, headerGroupingMaxDepth = props.headerGroupingMaxDepth, columnMenuState = props.columnMenuState, columnVisibility = props.columnVisibility, columnGroupsHeaderStructure = props.columnGroupsHeaderStructure, hasOtherElementInTabSequence = props.hasOtherElementInTabSequence;
    var _a = React.useState(''), dragCol = _a[0], setDragCol = _a[1];
    var _b = React.useState(''), resizeCol = _b[0], setResizeCol = _b[1];
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var columnGroupsModel = (0, utils_1.useGridSelector)(apiRef, gridColumnGroupsSelector_1.gridColumnGroupsUnwrappedModelSelector);
    var columnPositions = (0, utils_1.useGridSelector)(apiRef, columns_1.gridColumnPositionsSelector);
    var renderContext = (0, utils_1.useGridSelector)(apiRef, virtualization_1.gridRenderContextColumnsSelector);
    var pinnedColumns = (0, utils_1.useGridSelector)(apiRef, columns_1.gridVisiblePinnedColumnDefinitionsSelector);
    var columnsLookup = (0, utils_1.useGridSelector)(apiRef, columns_1.gridColumnLookupSelector);
    var offsetLeft = (0, x_virtualizer_1.computeOffsetLeft)(columnPositions, renderContext, pinnedColumns.left.length);
    var columnsTotalWidth = (0, utils_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridColumnsTotalWidthSelector);
    var gridHasFiller = (0, utils_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasFillerSelector);
    var headerHeight = (0, utils_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHeaderHeightSelector);
    var groupHeaderHeight = (0, utils_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridGroupHeaderHeightSelector);
    var scrollbarWidth = (0, utils_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridVerticalScrollbarWidthSelector);
    var handleColumnResizeStart = React.useCallback(function (params) { return setResizeCol(params.field); }, []);
    var handleColumnResizeStop = React.useCallback(function () { return setResizeCol(''); }, []);
    var handleColumnReorderStart = React.useCallback(function (params) { return setDragCol(params.field); }, []);
    var handleColumnReorderStop = React.useCallback(function () { return setDragCol(''); }, []);
    var leftRenderContext = React.useMemo(function () {
        return pinnedColumns.left.length
            ? {
                firstColumnIndex: 0,
                lastColumnIndex: pinnedColumns.left.length,
            }
            : null;
    }, [pinnedColumns.left.length]);
    var rightRenderContext = React.useMemo(function () {
        return pinnedColumns.right.length
            ? {
                firstColumnIndex: visibleColumns.length - pinnedColumns.right.length,
                lastColumnIndex: visibleColumns.length,
            }
            : null;
    }, [pinnedColumns.right.length, visibleColumns.length]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnResizeStart', handleColumnResizeStart);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnResizeStop', handleColumnResizeStop);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderDragEndNative', handleColumnReorderStop);
    // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
    var getColumnsToRender = function (params) {
        var _a = (params || {}).renderContext, currentContext = _a === void 0 ? renderContext : _a;
        var firstColumnToRender = currentContext.firstColumnIndex;
        // HACK: renderContext ins't always synchronized, this should be handled properly.
        var lastColumnToRender = Math.min(currentContext.lastColumnIndex, visibleColumns.length);
        var renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
        return {
            renderedColumns: renderedColumns,
            firstColumnToRender: firstColumnToRender,
            lastColumnToRender: lastColumnToRender,
        };
    };
    var getFillers = function (params, children, leftOverflow, borderBottom) {
        if (borderBottom === void 0) { borderBottom = false; }
        var isPinnedRight = (params === null || params === void 0 ? void 0 : params.position) === constants_1.PinnedColumnPosition.RIGHT;
        var isNotPinned = (params === null || params === void 0 ? void 0 : params.position) === undefined;
        var hasScrollbarFiller = (pinnedColumns.right.length > 0 && isPinnedRight) ||
            (pinnedColumns.right.length === 0 && isNotPinned);
        var leftOffsetWidth = offsetLeft - leftOverflow;
        return (<React.Fragment>
        {isNotPinned && <div role="presentation" style={{ width: leftOffsetWidth }}/>}
        {children}
        {isNotPinned && (<div role="presentation" className={(0, clsx_1.default)(gridClasses_1.gridClasses.filler, borderBottom && gridClasses_1.gridClasses['filler--borderBottom'])}/>)}
        {hasScrollbarFiller && (<GridScrollbarFillerCell_1.GridScrollbarFillerCell header pinnedRight={isPinnedRight} borderBottom={borderBottom} borderTop={false}/>)}
      </React.Fragment>);
    };
    var getColumnHeaders = function (params, other) {
        if (other === void 0) { other = {}; }
        var _a = getColumnsToRender(params), renderedColumns = _a.renderedColumns, firstColumnToRender = _a.firstColumnToRender;
        var columns = [];
        for (var i = 0; i < renderedColumns.length; i += 1) {
            var colDef = renderedColumns[i];
            var columnIndex = firstColumnToRender + i;
            var isFirstColumn = columnIndex === 0;
            var tabIndex = (columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field) ||
                (isFirstColumn && !hasOtherElementInTabSequence)
                ? 0
                : -1;
            var hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
            var open_1 = columnMenuState.open && columnMenuState.field === colDef.field;
            var pinnedPosition = params === null || params === void 0 ? void 0 : params.position;
            var pinnedOffset = (0, getPinnedCellOffset_1.getPinnedCellOffset)(pinnedPosition, colDef.computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            var siblingWithBorderingSeparator = pinnedPosition === constants_1.PinnedColumnPosition.RIGHT
                ? renderedColumns[i - 1]
                : renderedColumns[i + 1];
            var isSiblingFocused = siblingWithBorderingSeparator
                ? columnHeaderFocus !== null &&
                    columnHeaderFocus.field === siblingWithBorderingSeparator.field
                : false;
            var isLastUnpinned = columnIndex + 1 === columnPositions.length - pinnedColumns.right.length;
            var indexInSection = i;
            var sectionLength = renderedColumns.length;
            var showLeftBorder = (0, cellBorderUtils_1.shouldCellShowLeftBorder)(pinnedPosition, indexInSection);
            var showRightBorder = (0, cellBorderUtils_1.shouldCellShowRightBorder)(pinnedPosition, indexInSection, sectionLength, rootProps.showColumnVerticalBorder, gridHasFiller);
            columns.push(<GridColumnHeaderItem_1.GridColumnHeaderItem key={colDef.field} {...sortColumnLookup[colDef.field]} columnMenuOpen={open_1} filterItemsCounter={filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length} headerHeight={headerHeight} isDragging={colDef.field === dragCol} colDef={colDef} colIndex={columnIndex} isResizing={resizeCol === colDef.field} isLast={columnIndex === columnPositions.length - 1} hasFocus={hasFocus} tabIndex={tabIndex} pinnedPosition={pinnedPosition} pinnedOffset={pinnedOffset} isLastUnpinned={isLastUnpinned} isSiblingFocused={isSiblingFocused} showLeftBorder={showLeftBorder} showRightBorder={showRightBorder} {...other}/>);
        }
        return getFillers(params, columns, 0);
    };
    var getColumnHeadersRow = function () {
        return (<exports.GridColumnHeaderRow role="row" aria-rowindex={headerGroupingMaxDepth + 1} ownerState={rootProps} className={gridClasses_1.gridClasses['row--borderBottom']} style={{ height: headerHeight }}>
        {leftRenderContext &&
                getColumnHeaders({
                    position: constants_1.PinnedColumnPosition.LEFT,
                    renderContext: leftRenderContext,
                }, { disableReorder: true })}
        {getColumnHeaders({
                renderContext: renderContext,
            })}
        {rightRenderContext &&
                getColumnHeaders({
                    position: constants_1.PinnedColumnPosition.RIGHT,
                    renderContext: rightRenderContext,
                }, {
                    disableReorder: true,
                    separatorSide: GridColumnHeaderSeparator_1.GridColumnHeaderSeparatorSides.Left,
                })}
      </exports.GridColumnHeaderRow>);
    };
    var getColumnGroupHeaders = function (_a) {
        var _b, _c, _d, _e;
        var depth = _a.depth, params = _a.params;
        var columnsToRender = getColumnsToRender(params);
        if (columnsToRender.renderedColumns.length === 0) {
            return null;
        }
        var firstColumnToRender = columnsToRender.firstColumnToRender, lastColumnToRender = columnsToRender.lastColumnToRender;
        var rowStructure = columnGroupsHeaderStructure[depth];
        var firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
        var firstGroupToRender = (_c = (_b = columnGroupsModel[firstColumnFieldToRender]) === null || _b === void 0 ? void 0 : _b[depth]) !== null && _c !== void 0 ? _c : null;
        var firstGroupIndex = rowStructure.findIndex(function (_a) {
            var groupId = _a.groupId, columnFields = _a.columnFields;
            return groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender);
        });
        var lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
        var lastGroupToRender = (_e = (_d = columnGroupsModel[lastColumnFieldToRender]) === null || _d === void 0 ? void 0 : _d[depth]) !== null && _e !== void 0 ? _e : null;
        var lastGroupIndex = rowStructure.findIndex(function (_a) {
            var groupId = _a.groupId, columnFields = _a.columnFields;
            return groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender);
        });
        var visibleColumnGroupHeader = rowStructure
            .slice(firstGroupIndex, lastGroupIndex + 1)
            .map(function (groupStructure) {
            return __assign(__assign({}, groupStructure), { columnFields: groupStructure.columnFields.filter(function (field) { return columnVisibility[field] !== false; }) });
        })
            .filter(function (groupStructure) { return groupStructure.columnFields.length > 0; });
        var firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
        var hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
        var leftOverflow = hiddenGroupColumns.reduce(function (acc, field) {
            var _a;
            var column = columnsLookup[field];
            return acc + ((_a = column.computedWidth) !== null && _a !== void 0 ? _a : 0);
        }, 0);
        var columnIndex = firstColumnToRender;
        var children = visibleColumnGroupHeader.map(function (_a, index) {
            var groupId = _a.groupId, columnFields = _a.columnFields;
            var hasFocus = columnGroupHeaderFocus !== null &&
                columnGroupHeaderFocus.depth === depth &&
                columnFields.includes(columnGroupHeaderFocus.field);
            var tabIndex = columnGroupHeaderTabIndexState !== null &&
                columnGroupHeaderTabIndexState.depth === depth &&
                columnFields.includes(columnGroupHeaderTabIndexState.field)
                ? 0
                : -1;
            var headerInfo = {
                groupId: groupId,
                width: columnFields.reduce(function (acc, field) { return acc + columnsLookup[field].computedWidth; }, 0),
                fields: columnFields,
                colIndex: columnIndex,
                hasFocus: hasFocus,
                tabIndex: tabIndex,
            };
            var pinnedPosition = params.position;
            var pinnedOffset = (0, getPinnedCellOffset_1.getPinnedCellOffset)(pinnedPosition, headerInfo.width, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            columnIndex += columnFields.length;
            var indexInSection = index;
            if (pinnedPosition === constants_1.PinnedColumnPosition.LEFT) {
                // Group headers can expand to multiple columns, we need to adjust the index
                indexInSection = columnIndex - 1;
            }
            return (<GridColumnGroupHeader_1.GridColumnGroupHeader key={index} groupId={groupId} width={headerInfo.width} fields={headerInfo.fields} colIndex={headerInfo.colIndex} depth={depth} isLastColumn={index === visibleColumnGroupHeader.length - 1} maxDepth={headerGroupingMaxDepth} height={groupHeaderHeight} hasFocus={hasFocus} tabIndex={tabIndex} pinnedPosition={pinnedPosition} pinnedOffset={pinnedOffset} showLeftBorder={(0, cellBorderUtils_1.shouldCellShowLeftBorder)(pinnedPosition, indexInSection)} showRightBorder={(0, cellBorderUtils_1.shouldCellShowRightBorder)(pinnedPosition, indexInSection, visibleColumnGroupHeader.length, rootProps.showColumnVerticalBorder, gridHasFiller)}/>);
        });
        return getFillers(params, children, leftOverflow);
    };
    var getColumnGroupHeadersRows = function () {
        if (headerGroupingMaxDepth === 0) {
            return null;
        }
        var headerRows = [];
        for (var depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
            headerRows.push(<exports.GridColumnHeaderRow key={depth} role="row" aria-rowindex={depth + 1} ownerState={rootProps} style={{ height: groupHeaderHeight }}>
          {leftRenderContext &&
                    getColumnGroupHeaders({
                        depth: depth,
                        params: {
                            position: constants_1.PinnedColumnPosition.LEFT,
                            renderContext: leftRenderContext,
                            maxLastColumn: leftRenderContext.lastColumnIndex,
                        },
                    })}
          {getColumnGroupHeaders({ depth: depth, params: { renderContext: renderContext } })}
          {rightRenderContext &&
                    getColumnGroupHeaders({
                        depth: depth,
                        params: {
                            position: constants_1.PinnedColumnPosition.RIGHT,
                            renderContext: rightRenderContext,
                            maxLastColumn: rightRenderContext.lastColumnIndex,
                        },
                    })}
        </exports.GridColumnHeaderRow>);
        }
        return headerRows;
    };
    return {
        renderContext: renderContext,
        leftRenderContext: leftRenderContext,
        rightRenderContext: rightRenderContext,
        pinnedColumns: pinnedColumns,
        visibleColumns: visibleColumns,
        columnPositions: columnPositions,
        getFillers: getFillers,
        getColumnHeadersRow: getColumnHeadersRow,
        getColumnsToRender: getColumnsToRender,
        getColumnGroupHeadersRows: getColumnGroupHeadersRows,
        getPinnedCellOffset: getPinnedCellOffset_1.getPinnedCellOffset,
        isDragging: !!dragCol,
        getInnerProps: function () { return ({
            role: 'rowgroup',
        }); },
    };
};
exports.useGridColumnHeaders = useGridColumnHeaders;
