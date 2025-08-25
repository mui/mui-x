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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRow = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var useForkRef_1 = require("@mui/utils/useForkRef");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var isObjectEmpty_1 = require("@mui/x-internals/isObjectEmpty");
var gridEditRowModel_1 = require("../models/gridEditRowModel");
var gridClasses_1 = require("../constants/gridClasses");
var composeGridClasses_1 = require("../utils/composeGridClasses");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var cellBorderUtils_1 = require("../utils/cellBorderUtils");
var gridColumnsSelector_1 = require("../hooks/features/columns/gridColumnsSelector");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var useGridVisibleRows_1 = require("../hooks/utils/useGridVisibleRows");
var domUtils_1 = require("../utils/domUtils");
var gridCheckboxSelectionColDef_1 = require("../colDef/gridCheckboxSelectionColDef");
var gridActionsColDef_1 = require("../colDef/gridActionsColDef");
var constants_1 = require("../internals/constants");
var gridSortingSelector_1 = require("../hooks/features/sorting/gridSortingSelector");
var gridRowsSelector_1 = require("../hooks/features/rows/gridRowsSelector");
var gridEditingSelectors_1 = require("../hooks/features/editing/gridEditingSelectors");
var gridRowReorderSelector_1 = require("../hooks/features/rowReorder/gridRowReorderSelector");
var GridScrollbarFillerCell_1 = require("./GridScrollbarFillerCell");
var getPinnedCellOffset_1 = require("../internals/utils/getPinnedCellOffset");
var useGridConfiguration_1 = require("../hooks/utils/useGridConfiguration");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var createSelector_1 = require("../utils/createSelector");
var isRowReorderingEnabledSelector = (0, createSelector_1.createSelector)(gridEditingSelectors_1.gridEditRowsStateSelector, function (editRows, rowReordering) {
    if (!rowReordering) {
        return false;
    }
    var isEditingRows = !(0, isObjectEmpty_1.isObjectEmpty)(editRows);
    return !isEditingRows;
});
var GridRow = (0, forwardRef_1.forwardRef)(function GridRow(props, refProp) {
    var _a;
    var selected = props.selected, rowId = props.rowId, row = props.row, index = props.index, styleProp = props.style, rowHeight = props.rowHeight, className = props.className, visibleColumns = props.visibleColumns, pinnedColumns = props.pinnedColumns, offsetLeft = props.offsetLeft, columnsTotalWidth = props.columnsTotalWidth, firstColumnIndex = props.firstColumnIndex, lastColumnIndex = props.lastColumnIndex, focusedColumnIndex = props.focusedColumnIndex, isFirstVisible = props.isFirstVisible, isLastVisible = props.isLastVisible, isNotVisible = props.isNotVisible, showBottomBorder = props.showBottomBorder, scrollbarWidth = props.scrollbarWidth, gridHasFiller = props.gridHasFiller, onClick = props.onClick, onDoubleClick = props.onDoubleClick, onMouseEnter = props.onMouseEnter, onMouseLeave = props.onMouseLeave, onMouseOut = props.onMouseOut, onMouseOver = props.onMouseOver, other = __rest(props, ["selected", "rowId", "row", "index", "style", "rowHeight", "className", "visibleColumns", "pinnedColumns", "offsetLeft", "columnsTotalWidth", "firstColumnIndex", "lastColumnIndex", "focusedColumnIndex", "isFirstVisible", "isLastVisible", "isNotVisible", "showBottomBorder", "scrollbarWidth", "gridHasFiller", "onClick", "onDoubleClick", "onMouseEnter", "onMouseLeave", "onMouseOut", "onMouseOver"]);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var configuration = (0, useGridConfiguration_1.useGridConfiguration)();
    var ref = React.useRef(null);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var currentPage = (0, useGridVisibleRows_1.useGridVisibleRows)(apiRef, rootProps);
    var sortModel = (0, useGridSelector_1.useGridSelector)(apiRef, gridSortingSelector_1.gridSortModelSelector);
    var treeDepth = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsSelector_1.gridRowMaximumTreeDepthSelector);
    var columnPositions = (0, useGridSelector_1.useGridSelector)(apiRef, gridColumnsSelector_1.gridColumnPositionsSelector);
    var rowReordering = rootProps.rowReordering;
    var isRowReorderingEnabled = (0, useGridSelector_1.useGridSelector)(apiRef, isRowReorderingEnabledSelector, rowReordering);
    var isRowDragActive = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowReorderSelector_1.gridIsRowDragActiveSelector);
    var handleRef = (0, useForkRef_1.default)(ref, refProp);
    var rowNode = (0, gridRowsSelector_1.gridRowNodeSelector)(apiRef, rowId);
    var editing = (0, useGridSelector_1.useGridSelector)(apiRef, gridEditingSelectors_1.gridRowIsEditingSelector, {
        rowId: rowId,
        editMode: rootProps.editMode,
    });
    var editable = rootProps.editMode === gridEditRowModel_1.GridEditModes.Row;
    var hasFocusCell = focusedColumnIndex !== undefined;
    var hasVirtualFocusCellLeft = hasFocusCell &&
        focusedColumnIndex >= pinnedColumns.left.length &&
        focusedColumnIndex < firstColumnIndex;
    var hasVirtualFocusCellRight = hasFocusCell &&
        focusedColumnIndex < visibleColumns.length - pinnedColumns.right.length &&
        focusedColumnIndex >= lastColumnIndex;
    var classes = (0, composeGridClasses_1.composeGridClasses)(rootProps.classes, {
        root: [
            'row',
            selected && 'selected',
            editable && 'row--editable',
            editing && 'row--editing',
            isFirstVisible && 'row--firstVisible',
            isLastVisible && 'row--lastVisible',
            showBottomBorder && 'row--borderBottom',
            rowHeight === 'auto' && 'row--dynamicHeight',
        ],
    });
    var getRowAriaAttributes = configuration.hooks.useGridRowAriaAttributes();
    React.useLayoutEffect(function () {
        if (currentPage.range) {
            var rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
            // Pinned rows are not part of the visible rows
            if (rowIndex !== undefined) {
                apiRef.current.unstable_setLastMeasuredRowIndex(rowIndex);
            }
        }
        if (ref.current && rowHeight === 'auto') {
            return apiRef.current.observeRowHeight(ref.current, rowId);
        }
        return undefined;
    }, [apiRef, currentPage.range, rowHeight, rowId]);
    var publish = React.useCallback(function (eventName, propHandler) {
        return function (event) {
            // Ignore portal
            if ((0, domUtils_1.isEventTargetInPortal)(event)) {
                return;
            }
            // The row might have been deleted
            if (!apiRef.current.getRow(rowId)) {
                return;
            }
            apiRef.current.publishEvent(eventName, apiRef.current.getRowParams(rowId), event);
            if (propHandler) {
                propHandler(event);
            }
        };
    }, [apiRef, rowId]);
    var publishClick = React.useCallback(function (event) {
        var cell = (0, domUtils_1.findParentElementFromClassName)(event.target, gridClasses_1.gridClasses.cell);
        var field = cell === null || cell === void 0 ? void 0 : cell.getAttribute('data-field');
        // Check if the field is available because the cell that fills the empty
        // space of the row has no field.
        if (field) {
            // User clicked in the checkbox added by checkboxSelection
            if (field === gridCheckboxSelectionColDef_1.GRID_CHECKBOX_SELECTION_COL_DEF.field) {
                return;
            }
            // User opened a detail panel
            if (field === constants_1.GRID_DETAIL_PANEL_TOGGLE_FIELD) {
                return;
            }
            // User reorders a row
            if (field === '__reorder__') {
                return;
            }
            // User is editing a cell
            if (apiRef.current.getCellMode(rowId, field) === gridEditRowModel_1.GridCellModes.Edit) {
                return;
            }
            // User clicked a button from the "actions" column type
            var column = apiRef.current.getColumn(field);
            if ((column === null || column === void 0 ? void 0 : column.type) === gridActionsColDef_1.GRID_ACTIONS_COLUMN_TYPE) {
                return;
            }
        }
        publish('rowClick', onClick)(event);
    }, [apiRef, onClick, publish, rowId]);
    var slots = rootProps.slots, slotProps = rootProps.slotProps, disableColumnReorder = rootProps.disableColumnReorder;
    var heightEntry = (0, useGridSelector_1.useGridSelector)(apiRef, function () { return (__assign({}, apiRef.current.getRowHeightEntry(rowId))); }, undefined, useGridSelector_1.objectShallowCompare);
    var style = React.useMemo(function () {
        if (isNotVisible) {
            return {
                opacity: 0,
                width: 0,
                height: 0,
            };
        }
        var rowStyle = __assign(__assign({}, styleProp), { maxHeight: rowHeight === 'auto' ? 'none' : rowHeight, minHeight: rowHeight, '--height': typeof rowHeight === 'number' ? "".concat(rowHeight, "px") : rowHeight });
        if (heightEntry.spacingTop) {
            var property = rootProps.rowSpacingType === 'border' ? 'borderTopWidth' : 'marginTop';
            rowStyle[property] = heightEntry.spacingTop;
        }
        if (heightEntry.spacingBottom) {
            var property = rootProps.rowSpacingType === 'border' ? 'borderBottomWidth' : 'marginBottom';
            var propertyValue = rowStyle[property];
            // avoid overriding existing value
            if (typeof propertyValue !== 'number') {
                propertyValue = parseInt(propertyValue || '0', 10);
            }
            propertyValue += heightEntry.spacingBottom;
            rowStyle[property] = propertyValue;
        }
        return rowStyle;
    }, [isNotVisible, rowHeight, styleProp, heightEntry, rootProps.rowSpacingType]);
    // HACK: Sometimes, the rowNode has already been removed from the state but the row is still rendered.
    if (!rowNode) {
        return null;
    }
    var rowClassNames = apiRef.current.unstable_applyPipeProcessors('rowClassName', [], rowId);
    var ariaAttributes = getRowAriaAttributes(rowNode, index);
    if (typeof rootProps.getRowClassName === 'function') {
        var indexRelativeToCurrentPage = index - (((_a = currentPage.range) === null || _a === void 0 ? void 0 : _a.firstRowIndex) || 0);
        var rowParams = __assign(__assign({}, apiRef.current.getRowParams(rowId)), { isFirstVisible: indexRelativeToCurrentPage === 0, isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1, indexRelativeToCurrentPage: indexRelativeToCurrentPage });
        rowClassNames.push(rootProps.getRowClassName(rowParams));
    }
    var getCell = function (column, indexInSection, indexRelativeToAllColumns, sectionLength, pinnedPosition) {
        var _a, _b;
        if (pinnedPosition === void 0) { pinnedPosition = constants_1.PinnedColumnPosition.NONE; }
        var cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, indexRelativeToAllColumns);
        if (cellColSpanInfo === null || cellColSpanInfo === void 0 ? void 0 : cellColSpanInfo.spannedByColSpan) {
            return null;
        }
        var width = (_a = cellColSpanInfo === null || cellColSpanInfo === void 0 ? void 0 : cellColSpanInfo.cellProps.width) !== null && _a !== void 0 ? _a : column.computedWidth;
        var colSpan = (_b = cellColSpanInfo === null || cellColSpanInfo === void 0 ? void 0 : cellColSpanInfo.cellProps.colSpan) !== null && _b !== void 0 ? _b : 1;
        var pinnedOffset = (0, getPinnedCellOffset_1.getPinnedCellOffset)(pinnedPosition, column.computedWidth, indexRelativeToAllColumns, columnPositions, columnsTotalWidth, scrollbarWidth);
        if (rowNode.type === 'skeletonRow') {
            return (<slots.skeletonCell key={column.field} type={column.type} width={width} height={rowHeight} field={column.field} align={column.align}/>);
        }
        // when the cell is a reorder cell we are not allowing to reorder the col
        // fixes https://github.com/mui/mui-x/issues/11126
        var isReorderCell = column.field === '__reorder__';
        var canReorderColumn = !(disableColumnReorder || column.disableReorder);
        var canReorderRow = isRowReorderingEnabled && !sortModel.length && treeDepth <= 1;
        var disableDragEvents = !(canReorderColumn ||
            (isReorderCell && canReorderRow) ||
            isRowDragActive);
        var cellIsNotVisible = pinnedPosition === constants_1.PinnedColumnPosition.VIRTUAL;
        var showLeftBorder = (0, cellBorderUtils_1.shouldCellShowLeftBorder)(pinnedPosition, indexInSection);
        var showRightBorder = (0, cellBorderUtils_1.shouldCellShowRightBorder)(pinnedPosition, indexInSection, sectionLength, rootProps.showCellVerticalBorder, gridHasFiller);
        return (<slots.cell key={column.field} column={column} width={width} rowId={rowId} align={column.align || 'left'} colIndex={indexRelativeToAllColumns} colSpan={colSpan} disableDragEvents={disableDragEvents} isNotVisible={cellIsNotVisible} pinnedOffset={pinnedOffset} pinnedPosition={pinnedPosition} showLeftBorder={showLeftBorder} showRightBorder={showRightBorder} row={row} rowNode={rowNode} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.cell}/>);
    };
    var leftCells = pinnedColumns.left.map(function (column, i) {
        var indexRelativeToAllColumns = i;
        return getCell(column, i, indexRelativeToAllColumns, pinnedColumns.left.length, constants_1.PinnedColumnPosition.LEFT);
    });
    var rightCells = pinnedColumns.right.map(function (column, i) {
        var indexRelativeToAllColumns = visibleColumns.length - pinnedColumns.right.length + i;
        return getCell(column, i, indexRelativeToAllColumns, pinnedColumns.right.length, constants_1.PinnedColumnPosition.RIGHT);
    });
    var middleColumnsLength = visibleColumns.length - pinnedColumns.left.length - pinnedColumns.right.length;
    var cells = [];
    if (hasVirtualFocusCellLeft) {
        cells.push(getCell(visibleColumns[focusedColumnIndex], focusedColumnIndex - pinnedColumns.left.length, focusedColumnIndex, middleColumnsLength, constants_1.PinnedColumnPosition.VIRTUAL));
    }
    for (var i = firstColumnIndex; i < lastColumnIndex; i += 1) {
        var column = visibleColumns[i];
        var indexInSection = i - pinnedColumns.left.length;
        if (!column) {
            continue;
        }
        cells.push(getCell(column, indexInSection, i, middleColumnsLength));
    }
    if (hasVirtualFocusCellRight) {
        cells.push(getCell(visibleColumns[focusedColumnIndex], focusedColumnIndex - pinnedColumns.left.length, focusedColumnIndex, middleColumnsLength, constants_1.PinnedColumnPosition.VIRTUAL));
    }
    var eventHandlers = row
        ? {
            onClick: publishClick,
            onDoubleClick: publish('rowDoubleClick', onDoubleClick),
            onMouseEnter: publish('rowMouseEnter', onMouseEnter),
            onMouseLeave: publish('rowMouseLeave', onMouseLeave),
            onMouseOut: publish('rowMouseOut', onMouseOut),
            onMouseOver: publish('rowMouseOver', onMouseOver),
        }
        : null;
    return (<div data-id={rowId} data-rowindex={index} role="row" className={clsx_1.default.apply(void 0, __spreadArray(__spreadArray([], rowClassNames, false), [classes.root, className], false))} style={style} {...ariaAttributes} {...eventHandlers} {...other} ref={handleRef}>
      {leftCells}
      <div role="presentation" className={gridClasses_1.gridClasses.cellOffsetLeft} style={{ width: offsetLeft }}/>
      {cells}
      <div role="presentation" className={(0, clsx_1.default)(gridClasses_1.gridClasses.cell, gridClasses_1.gridClasses.cellEmpty)}/>
      {rightCells}
      {scrollbarWidth !== 0 && (<GridScrollbarFillerCell_1.GridScrollbarFillerCell pinnedRight={pinnedColumns.right.length > 0} borderTop={!isFirstVisible}/>)}
    </div>);
});
GridRow.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnsTotalWidth: prop_types_1.default.number.isRequired,
    firstColumnIndex: prop_types_1.default.number.isRequired,
    /**
     * Determines which cell has focus.
     * If `null`, no cell in this row has focus.
     */
    focusedColumnIndex: prop_types_1.default.number,
    gridHasFiller: prop_types_1.default.bool.isRequired,
    /**
     * Index of the row in the whole sorted and filtered dataset.
     * If some rows above have expanded children, this index also take those children into account.
     */
    index: prop_types_1.default.number.isRequired,
    isFirstVisible: prop_types_1.default.bool.isRequired,
    isLastVisible: prop_types_1.default.bool.isRequired,
    isNotVisible: prop_types_1.default.bool.isRequired,
    lastColumnIndex: prop_types_1.default.number.isRequired,
    offsetLeft: prop_types_1.default.number.isRequired,
    onClick: prop_types_1.default.func,
    onDoubleClick: prop_types_1.default.func,
    onMouseEnter: prop_types_1.default.func,
    onMouseLeave: prop_types_1.default.func,
    pinnedColumns: prop_types_1.default.object.isRequired,
    row: prop_types_1.default.object.isRequired,
    rowHeight: prop_types_1.default.oneOfType([prop_types_1.default.oneOf(['auto']), prop_types_1.default.number]).isRequired,
    rowId: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]).isRequired,
    scrollbarWidth: prop_types_1.default.number.isRequired,
    selected: prop_types_1.default.bool.isRequired,
    showBottomBorder: prop_types_1.default.bool.isRequired,
    visibleColumns: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
};
var MemoizedGridRow = (0, fastMemo_1.fastMemo)(GridRow);
exports.GridRow = MemoizedGridRow;
