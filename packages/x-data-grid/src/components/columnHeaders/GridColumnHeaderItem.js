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
exports.GridColumnHeaderItem = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useId_1 = require("@mui/utils/useId");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var ColumnHeaderMenuIcon_1 = require("./ColumnHeaderMenuIcon");
var GridColumnHeaderMenu_1 = require("../menu/columnMenu/GridColumnHeaderMenu");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var GridGenericColumnHeaderItem_1 = require("./GridGenericColumnHeaderItem");
var domUtils_1 = require("../../utils/domUtils");
var constants_1 = require("../../internals/constants");
var utils_1 = require("../../internals/utils");
var useUtilityClasses = function (ownerState) {
    var disableColumnSorting = (0, useGridRootProps_1.useGridRootProps)().disableColumnSorting;
    var colDef = ownerState.colDef, classes = ownerState.classes, isDragging = ownerState.isDragging, sortDirection = ownerState.sortDirection, showRightBorder = ownerState.showRightBorder, showLeftBorder = ownerState.showLeftBorder, filterItemsCounter = ownerState.filterItemsCounter, pinnedPosition = ownerState.pinnedPosition, isLastUnpinned = ownerState.isLastUnpinned, isSiblingFocused = ownerState.isSiblingFocused;
    var isColumnSortable = colDef.sortable && !disableColumnSorting;
    var isColumnSorted = sortDirection != null;
    var isColumnFiltered = filterItemsCounter != null && filterItemsCounter > 0;
    // todo refactor to a prop on col isNumeric or ?? ie: coltype===price wont work
    var isColumnNumeric = colDef.type === 'number';
    var slots = {
        root: [
            'columnHeader',
            colDef.headerAlign === 'left' && 'columnHeader--alignLeft',
            colDef.headerAlign === 'center' && 'columnHeader--alignCenter',
            colDef.headerAlign === 'right' && 'columnHeader--alignRight',
            isColumnSortable && 'columnHeader--sortable',
            isDragging && 'columnHeader--moving',
            isColumnSorted && 'columnHeader--sorted',
            isColumnFiltered && 'columnHeader--filtered',
            isColumnNumeric && 'columnHeader--numeric',
            'withBorderColor',
            showRightBorder && 'columnHeader--withRightBorder',
            showLeftBorder && 'columnHeader--withLeftBorder',
            pinnedPosition === constants_1.PinnedColumnPosition.LEFT && 'columnHeader--pinnedLeft',
            pinnedPosition === constants_1.PinnedColumnPosition.RIGHT && 'columnHeader--pinnedRight',
            // TODO: Remove classes below and restore `:has` selectors when they are supported in jsdom
            // See https://github.com/mui/mui-x/pull/14559
            isLastUnpinned && 'columnHeader--lastUnpinned',
            isSiblingFocused && 'columnHeader--siblingFocused',
        ],
        draggableContainer: ['columnHeaderDraggableContainer'],
        titleContainer: ['columnHeaderTitleContainer'],
        titleContainerContent: ['columnHeaderTitleContainerContent'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
function GridColumnHeaderItem(props) {
    var _a, _b, _c, _d, _e;
    var colDef = props.colDef, columnMenuOpen = props.columnMenuOpen, colIndex = props.colIndex, headerHeight = props.headerHeight, isResizing = props.isResizing, isLast = props.isLast, sortDirection = props.sortDirection, sortIndex = props.sortIndex, filterItemsCounter = props.filterItemsCounter, hasFocus = props.hasFocus, tabIndex = props.tabIndex, disableReorder = props.disableReorder, separatorSide = props.separatorSide, showLeftBorder = props.showLeftBorder, showRightBorder = props.showRightBorder, pinnedPosition = props.pinnedPosition, pinnedOffset = props.pinnedOffset;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var headerCellRef = React.useRef(null);
    var columnMenuId = (0, useId_1.default)();
    var columnMenuButtonId = (0, useId_1.default)();
    var iconButtonRef = React.useRef(null);
    var _f = React.useState(columnMenuOpen), showColumnMenuIcon = _f[0], setShowColumnMenuIcon = _f[1];
    var isDraggable = React.useMemo(function () { return !rootProps.disableColumnReorder && !disableReorder && !colDef.disableReorder; }, [rootProps.disableColumnReorder, disableReorder, colDef.disableReorder]);
    var headerComponent;
    if (colDef.renderHeader) {
        headerComponent = colDef.renderHeader(apiRef.current.getColumnHeaderParams(colDef.field));
    }
    var ownerState = __assign(__assign({}, props), { classes: rootProps.classes, showRightBorder: showRightBorder, showLeftBorder: showLeftBorder });
    var classes = useUtilityClasses(ownerState);
    var publish = React.useCallback(function (eventName) { return function (event) {
        // Ignore portal
        // See https://github.com/mui/mui-x/issues/1721
        if ((0, domUtils_1.isEventTargetInPortal)(event)) {
            return;
        }
        apiRef.current.publishEvent(eventName, apiRef.current.getColumnHeaderParams(colDef.field), event);
    }; }, [apiRef, colDef.field]);
    var mouseEventsHandlers = React.useMemo(function () { return ({
        onClick: publish('columnHeaderClick'),
        onContextMenu: publish('columnHeaderContextMenu'),
        onDoubleClick: publish('columnHeaderDoubleClick'),
        onMouseOver: publish('columnHeaderOver'), // TODO remove as it's not used
        onMouseOut: publish('columnHeaderOut'), // TODO remove as it's not used
        onMouseEnter: publish('columnHeaderEnter'), // TODO remove as it's not used
        onMouseLeave: publish('columnHeaderLeave'), // TODO remove as it's not used
        onKeyDown: publish('columnHeaderKeyDown'),
        onFocus: publish('columnHeaderFocus'),
        onBlur: publish('columnHeaderBlur'),
    }); }, [publish]);
    var draggableEventHandlers = React.useMemo(function () {
        return isDraggable
            ? {
                onDragStart: publish('columnHeaderDragStart'),
                onDragEnter: publish('columnHeaderDragEnter'),
                onDragOver: publish('columnHeaderDragOver'),
                onDragEndCapture: publish('columnHeaderDragEnd'),
            }
            : {};
    }, [isDraggable, publish]);
    var columnHeaderSeparatorProps = React.useMemo(function () { return ({
        onMouseDown: publish('columnSeparatorMouseDown'),
        onDoubleClick: publish('columnSeparatorDoubleClick'),
    }); }, [publish]);
    React.useEffect(function () {
        if (!showColumnMenuIcon) {
            setShowColumnMenuIcon(columnMenuOpen);
        }
    }, [showColumnMenuIcon, columnMenuOpen]);
    var handleExited = React.useCallback(function () {
        setShowColumnMenuIcon(false);
    }, []);
    var columnMenuIconButton = !rootProps.disableColumnMenu && !colDef.disableColumnMenu && (<ColumnHeaderMenuIcon_1.ColumnHeaderMenuIcon colDef={colDef} columnMenuId={columnMenuId} columnMenuButtonId={columnMenuButtonId} open={showColumnMenuIcon} iconButtonRef={iconButtonRef}/>);
    var columnMenu = (<GridColumnHeaderMenu_1.GridColumnHeaderMenu columnMenuId={columnMenuId} columnMenuButtonId={columnMenuButtonId} field={colDef.field} open={columnMenuOpen} target={iconButtonRef.current} ContentComponent={rootProps.slots.columnMenu} contentComponentProps={(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.columnMenu} onExited={handleExited}/>);
    var sortingOrder = (_b = colDef.sortingOrder) !== null && _b !== void 0 ? _b : rootProps.sortingOrder;
    var showSortIcon = (colDef.sortable || sortDirection != null) &&
        !colDef.hideSortIcons &&
        !rootProps.disableColumnSorting;
    var columnTitleIconButtons = (<React.Fragment>
      {!rootProps.disableColumnFilter && (<rootProps.slots.columnHeaderFilterIconButton field={colDef.field} counter={filterItemsCounter} {...(_c = rootProps.slotProps) === null || _c === void 0 ? void 0 : _c.columnHeaderFilterIconButton}/>)}

      {showSortIcon && (<rootProps.slots.columnHeaderSortIcon field={colDef.field} direction={sortDirection} index={sortIndex} sortingOrder={sortingOrder} disabled={!colDef.sortable} {...(_d = rootProps.slotProps) === null || _d === void 0 ? void 0 : _d.columnHeaderSortIcon}/>)}
    </React.Fragment>);
    React.useLayoutEffect(function () {
        var _a;
        var columnMenuState = apiRef.current.state.columnMenu;
        if (hasFocus && !columnMenuState.open) {
            var focusableElement = headerCellRef.current.querySelector('[tabindex="0"]');
            var elementToFocus = focusableElement || headerCellRef.current;
            elementToFocus === null || elementToFocus === void 0 ? void 0 : elementToFocus.focus();
            if ((_a = apiRef.current.columnHeadersContainerRef) === null || _a === void 0 ? void 0 : _a.current) {
                apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
            }
        }
    }, [apiRef, hasFocus]);
    var headerClassName = typeof colDef.headerClassName === 'function'
        ? colDef.headerClassName({ field: colDef.field, colDef: colDef })
        : colDef.headerClassName;
    var label = (_e = colDef.headerName) !== null && _e !== void 0 ? _e : colDef.field;
    var style = React.useMemo(function () { return (0, utils_1.attachPinnedStyle)(__assign({}, props.style), isRtl, pinnedPosition, pinnedOffset); }, [pinnedPosition, pinnedOffset, props.style, isRtl]);
    return (<GridGenericColumnHeaderItem_1.GridGenericColumnHeaderItem ref={headerCellRef} classes={classes} columnMenuOpen={columnMenuOpen} colIndex={colIndex} height={headerHeight} isResizing={isResizing} sortDirection={sortDirection} hasFocus={hasFocus} tabIndex={tabIndex} separatorSide={separatorSide} isDraggable={isDraggable} headerComponent={headerComponent} description={colDef.description} elementId={colDef.field} width={colDef.computedWidth} columnMenuIconButton={columnMenuIconButton} columnTitleIconButtons={columnTitleIconButtons} headerClassName={(0, clsx_1.default)(headerClassName, isLast && gridClasses_1.gridClasses['columnHeader--last'])} label={label} resizable={!rootProps.disableColumnResize && !!colDef.resizable} data-field={colDef.field} columnMenu={columnMenu} draggableContainerProps={draggableEventHandlers} columnHeaderSeparatorProps={columnHeaderSeparatorProps} style={style} {...mouseEventsHandlers}/>);
}
GridColumnHeaderItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    colIndex: prop_types_1.default.number.isRequired,
    columnMenuOpen: prop_types_1.default.bool.isRequired,
    disableReorder: prop_types_1.default.bool,
    filterItemsCounter: prop_types_1.default.number,
    hasFocus: prop_types_1.default.bool,
    headerHeight: prop_types_1.default.number.isRequired,
    isDragging: prop_types_1.default.bool.isRequired,
    isLast: prop_types_1.default.bool.isRequired,
    isLastUnpinned: prop_types_1.default.bool.isRequired,
    isResizing: prop_types_1.default.bool.isRequired,
    isSiblingFocused: prop_types_1.default.bool.isRequired,
    pinnedOffset: prop_types_1.default.number,
    pinnedPosition: prop_types_1.default.oneOf([0, 1, 2, 3]),
    separatorSide: prop_types_1.default.oneOf(['left', 'right']),
    showLeftBorder: prop_types_1.default.bool.isRequired,
    showRightBorder: prop_types_1.default.bool.isRequired,
    sortDirection: prop_types_1.default.oneOf(['asc', 'desc']),
    sortIndex: prop_types_1.default.number,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.oneOf([-1, 0]).isRequired,
};
var Memoized = (0, fastMemo_1.fastMemo)(GridColumnHeaderItem);
exports.GridColumnHeaderItem = Memoized;
