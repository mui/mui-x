"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridSkeletonLoadingOverlay = exports.GridSkeletonLoadingOverlayInner = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var hooks_1 = require("../hooks");
var constants_1 = require("../internals/constants");
var gridDimensionsSelectors_1 = require("../hooks/features/dimensions/gridDimensionsSelectors");
var gridClasses_1 = require("../constants/gridClasses");
var getPinnedCellOffset_1 = require("../internals/utils/getPinnedCellOffset");
var cellBorderUtils_1 = require("../utils/cellBorderUtils");
var domUtils_1 = require("../utils/domUtils");
var GridScrollbarFillerCell_1 = require("./GridScrollbarFillerCell");
var rtlFlipSide_1 = require("../utils/rtlFlipSide");
var utils_1 = require("../internals/utils");
var SkeletonOverlay = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'SkeletonLoadingOverlay',
})({
    minWidth: '100%',
    width: 'max-content', // prevents overflow: clip; cutting off the x axis
    height: '100%',
    overflow: 'clip', // y axis is hidden while the x axis is allowed to overflow
});
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['skeletonLoadingOverlay'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var getColIndex = function (el) { return parseInt(el.getAttribute('data-colindex'), 10); };
exports.GridSkeletonLoadingOverlayInner = (0, forwardRef_1.forwardRef)(function GridSkeletonLoadingOverlayInner(props, forwardedRef) {
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var slots = rootProps.slots;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var classes = useUtilityClasses({ classes: rootProps.classes });
    var ref = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(ref, forwardedRef);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var dimensions = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridDimensionsSelector);
    var totalWidth = (0, hooks_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridColumnsTotalWidthSelector);
    var positions = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridColumnPositionsSelector);
    var inViewportCount = React.useMemo(function () { return positions.filter(function (value) { return value <= totalWidth; }).length; }, [totalWidth, positions]);
    var skeletonRowsCount = props.skeletonRowsCount, visibleColumns = props.visibleColumns, showFirstRowBorder = props.showFirstRowBorder, rest = __rest(props, ["skeletonRowsCount", "visibleColumns", "showFirstRowBorder"]);
    var allVisibleColumns = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridVisibleColumnDefinitionsSelector);
    var columns = React.useMemo(function () { return allVisibleColumns.slice(0, inViewportCount); }, [allVisibleColumns, inViewportCount]);
    var pinnedColumns = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridVisiblePinnedColumnDefinitionsSelector);
    var getPinnedPosition = React.useCallback(function (field) {
        if (pinnedColumns.left.findIndex(function (col) { return col.field === field; }) !== -1) {
            return constants_1.PinnedColumnPosition.LEFT;
        }
        if (pinnedColumns.right.findIndex(function (col) { return col.field === field; }) !== -1) {
            return constants_1.PinnedColumnPosition.RIGHT;
        }
        return undefined;
    }, [pinnedColumns.left, pinnedColumns.right]);
    var children = React.useMemo(function () {
        var array = [];
        for (var i = 0; i < skeletonRowsCount; i += 1) {
            var rowCells = [];
            var _loop_1 = function (colIndex) {
                var column = columns[colIndex];
                var pinnedPosition = getPinnedPosition(column.field);
                var isPinnedLeft = pinnedPosition === constants_1.PinnedColumnPosition.LEFT;
                var isPinnedRight = pinnedPosition === constants_1.PinnedColumnPosition.RIGHT;
                var pinnedSide = (0, rtlFlipSide_1.rtlFlipSide)(pinnedPosition, isRtl);
                var sectionLength = pinnedSide
                    ? pinnedColumns[pinnedSide].length // pinned section
                    : columns.length - pinnedColumns.left.length - pinnedColumns.right.length; // middle section
                var sectionIndex = pinnedSide
                    ? pinnedColumns[pinnedSide].findIndex(function (col) { return col.field === column.field; }) // pinned section
                    : colIndex - pinnedColumns.left.length; // middle section
                var scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
                var pinnedStyle = (0, utils_1.attachPinnedStyle)({}, isRtl, pinnedPosition, (0, getPinnedCellOffset_1.getPinnedCellOffset)(pinnedPosition, column.computedWidth, colIndex, positions, dimensions.columnsTotalWidth, scrollbarWidth));
                var gridHasFiller = dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;
                var showRightBorder = (0, cellBorderUtils_1.shouldCellShowRightBorder)(pinnedPosition, sectionIndex, sectionLength, rootProps.showCellVerticalBorder, gridHasFiller);
                var showLeftBorder = (0, cellBorderUtils_1.shouldCellShowLeftBorder)(pinnedPosition, sectionIndex);
                var isLastColumn = colIndex === columns.length - 1;
                var isFirstPinnedRight = isPinnedRight && sectionIndex === 0;
                var hasFillerBefore = isFirstPinnedRight && gridHasFiller;
                var hasFillerAfter = isLastColumn && !isFirstPinnedRight && gridHasFiller;
                var expandedWidth = dimensions.viewportOuterSize.width - dimensions.columnsTotalWidth;
                var emptyCellWidth = Math.max(0, expandedWidth);
                var emptyCell = (<slots.skeletonCell key={"skeleton-filler-column-".concat(i)} width={emptyCellWidth} empty/>);
                var hasScrollbarFiller = isLastColumn && scrollbarWidth !== 0;
                if (hasFillerBefore) {
                    rowCells.push(emptyCell);
                }
                rowCells.push(<slots.skeletonCell key={"skeleton-column-".concat(i, "-").concat(column.field)} field={column.field} type={column.type} align={column.align} width="var(--width)" height={dimensions.rowHeight} data-colindex={colIndex} empty={visibleColumns && !visibleColumns.has(column.field)} className={(0, clsx_1.default)(isPinnedLeft && gridClasses_1.gridClasses['cell--pinnedLeft'], isPinnedRight && gridClasses_1.gridClasses['cell--pinnedRight'], showRightBorder && gridClasses_1.gridClasses['cell--withRightBorder'], showLeftBorder && gridClasses_1.gridClasses['cell--withLeftBorder'])} style={__assign({ '--width': "".concat(column.computedWidth, "px") }, pinnedStyle)}/>);
                if (hasFillerAfter) {
                    rowCells.push(emptyCell);
                }
                if (hasScrollbarFiller) {
                    rowCells.push(<GridScrollbarFillerCell_1.GridScrollbarFillerCell key={"skeleton-scrollbar-filler-".concat(i)} pinnedRight={pinnedColumns.right.length > 0}/>);
                }
            };
            for (var colIndex = 0; colIndex < columns.length; colIndex += 1) {
                _loop_1(colIndex);
            }
            array.push(<div key={"skeleton-row-".concat(i)} className={(0, clsx_1.default)(gridClasses_1.gridClasses.row, gridClasses_1.gridClasses.rowSkeleton, i === 0 && !showFirstRowBorder && gridClasses_1.gridClasses['row--firstVisible'])}>
          {rowCells}
        </div>);
        }
        return array;
    }, [
        skeletonRowsCount,
        columns,
        getPinnedPosition,
        isRtl,
        pinnedColumns,
        dimensions.hasScrollY,
        dimensions.scrollbarSize,
        dimensions.columnsTotalWidth,
        dimensions.viewportOuterSize.width,
        dimensions.rowHeight,
        positions,
        rootProps.showCellVerticalBorder,
        slots,
        visibleColumns,
        showFirstRowBorder,
    ]);
    // Sync the column resize of the overlay columns with the grid
    var handleColumnResize = function (params) {
        var _a, _b, _c;
        var colDef = params.colDef, width = params.width;
        var cells = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[data-field=\"".concat((0, domUtils_1.escapeOperandAttributeSelector)(colDef.field), "\"]"));
        if (!cells) {
            throw new Error('MUI X: Expected skeleton cells to be defined with `data-field` attribute.');
        }
        var resizedColIndex = columns.findIndex(function (col) { return col.field === colDef.field; });
        var pinnedPosition = getPinnedPosition(colDef.field);
        var isPinnedLeft = pinnedPosition === constants_1.PinnedColumnPosition.LEFT;
        var isPinnedRight = pinnedPosition === constants_1.PinnedColumnPosition.RIGHT;
        var currentWidth = getComputedStyle(cells[0]).getPropertyValue('--width');
        var delta = parseInt(currentWidth, 10) - width;
        if (cells) {
            cells.forEach(function (element) {
                element.style.setProperty('--width', "".concat(width, "px"));
            });
        }
        if (isPinnedLeft) {
            var pinnedCells = (_b = ref.current) === null || _b === void 0 ? void 0 : _b.querySelectorAll(".".concat(gridClasses_1.gridClasses['cell--pinnedLeft']));
            pinnedCells === null || pinnedCells === void 0 ? void 0 : pinnedCells.forEach(function (element) {
                var colIndex = getColIndex(element);
                if (colIndex > resizedColIndex) {
                    element.style.left = "".concat(parseInt(getComputedStyle(element).left, 10) - delta, "px");
                }
            });
        }
        if (isPinnedRight) {
            var pinnedCells = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.querySelectorAll(".".concat(gridClasses_1.gridClasses['cell--pinnedRight']));
            pinnedCells === null || pinnedCells === void 0 ? void 0 : pinnedCells.forEach(function (element) {
                var colIndex = getColIndex(element);
                if (colIndex < resizedColIndex) {
                    element.style.right = "".concat(parseInt(getComputedStyle(element).right, 10) + delta, "px");
                }
            });
        }
    };
    (0, hooks_1.useGridEvent)(apiRef, 'columnResize', handleColumnResize);
    return (<SkeletonOverlay className={classes.root} {...rest} ref={handleRef}>
      {children}
    </SkeletonOverlay>);
});
exports.GridSkeletonLoadingOverlay = (0, forwardRef_1.forwardRef)(function GridSkeletonLoadingOverlay(props, forwardedRef) {
    var _a;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var dimensions = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridDimensionsSelector);
    var viewportHeight = (_a = dimensions === null || dimensions === void 0 ? void 0 : dimensions.viewportInnerSize.height) !== null && _a !== void 0 ? _a : 0;
    var skeletonRowsCount = Math.ceil(viewportHeight / dimensions.rowHeight);
    return (<exports.GridSkeletonLoadingOverlayInner {...props} skeletonRowsCount={skeletonRowsCount} ref={forwardedRef}/>);
});
