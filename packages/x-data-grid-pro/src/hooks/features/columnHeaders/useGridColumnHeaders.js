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
exports.useGridColumnHeadersPro = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var composeClasses_1 = require("@mui/utils/composeClasses");
var useGridRootProps_1 = require("../../utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    return React.useMemo(function () {
        var slots = {
            headerFilterRow: ['headerFilterRow'],
        };
        return (0, composeClasses_1.default)(slots, x_data_grid_1.getDataGridUtilityClass, classes);
    }, [classes]);
};
var useGridColumnHeadersPro = function (props) {
    var apiRef = (0, internals_1.useGridPrivateApiContext)();
    var headerGroupingMaxDepth = props.headerGroupingMaxDepth, hasOtherElementInTabSequence = props.hasOtherElementInTabSequence;
    var columnHeaderFilterTabIndexState = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridTabIndexColumnHeaderFilterSelector);
    var _a = (0, internals_1.useGridColumnHeaders)(__assign(__assign({}, props), { hasOtherElementInTabSequence: hasOtherElementInTabSequence || columnHeaderFilterTabIndexState !== null })), getColumnsToRender = _a.getColumnsToRender, getPinnedCellOffset = _a.getPinnedCellOffset, renderContext = _a.renderContext, leftRenderContext = _a.leftRenderContext, rightRenderContext = _a.rightRenderContext, pinnedColumns = _a.pinnedColumns, visibleColumns = _a.visibleColumns, columnPositions = _a.columnPositions, otherProps = __rest(_a, ["getColumnsToRender", "getPinnedCellOffset", "renderContext", "leftRenderContext", "rightRenderContext", "pinnedColumns", "visibleColumns", "columnPositions"]);
    var headerFiltersRef = React.useRef(null);
    apiRef.current.register('private', {
        headerFiltersElementRef: headerFiltersRef,
    });
    var headerFilterMenuRef = React.useRef(null);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var disableHeaderFiltering = !rootProps.headerFilters;
    var filterModel = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFilterModelSelector);
    var columnsTotalWidth = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridColumnsTotalWidthSelector);
    var gridHasFiller = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridHasFillerSelector);
    var headerFilterHeight = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridHeaderFilterHeightSelector);
    var scrollbarWidth = (0, x_data_grid_1.useGridSelector)(apiRef, internals_1.gridVerticalScrollbarWidthSelector);
    var columnHeaderFilterFocus = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridFocusColumnHeaderFilterSelector);
    var filterItemsCache = React.useRef(Object.create(null)).current;
    var getFilterItem = React.useCallback(function (colDef) {
        var filterModelItem = filterModel === null || filterModel === void 0 ? void 0 : filterModel.items.find(function (it) { return it.field === colDef.field && it.operator !== 'isAnyOf'; });
        if (filterModelItem != null) {
            // there's a valid `filterModelItem` for this column
            return filterModelItem;
        }
        var defaultCachedItem = filterItemsCache[colDef.field];
        if (defaultCachedItem != null) {
            // there's a cached `defaultItem` for this column
            return defaultCachedItem;
        }
        // there's no cached `defaultItem` for this column, let's generate one and cache it
        var defaultItem = (0, internals_1.getGridFilter)(colDef);
        filterItemsCache[colDef.field] = defaultItem;
        return defaultItem;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterModel]);
    var getColumnFilters = function (params) {
        var _a;
        var _b = getColumnsToRender(params), renderedColumns = _b.renderedColumns, firstColumnToRender = _b.firstColumnToRender;
        var filters = [];
        for (var i = 0; i < renderedColumns.length; i += 1) {
            var colDef = renderedColumns[i];
            var columnIndex = firstColumnToRender + i;
            var hasFocus = (columnHeaderFilterFocus === null || columnHeaderFilterFocus === void 0 ? void 0 : columnHeaderFilterFocus.field) === colDef.field;
            var isFirstColumn = columnIndex === 0;
            var tabIndexField = columnHeaderFilterTabIndexState === null || columnHeaderFilterTabIndexState === void 0 ? void 0 : columnHeaderFilterTabIndexState.field;
            var tabIndex = tabIndexField === colDef.field || (isFirstColumn && !props.hasOtherElementInTabSequence)
                ? 0
                : -1;
            var headerClassName = typeof colDef.headerClassName === 'function'
                ? colDef.headerClassName({ field: colDef.field, colDef: colDef })
                : colDef.headerClassName;
            var item = getFilterItem(colDef);
            var pinnedPosition = params === null || params === void 0 ? void 0 : params.position;
            var pinnedOffset = getPinnedCellOffset(pinnedPosition, colDef.computedWidth, columnIndex, columnPositions, columnsTotalWidth, scrollbarWidth);
            var indexInSection = i;
            var sectionLength = renderedColumns.length;
            var showLeftBorder = (0, internals_1.shouldCellShowLeftBorder)(pinnedPosition, indexInSection);
            var showRightBorder = (0, internals_1.shouldCellShowRightBorder)(pinnedPosition, indexInSection, sectionLength, rootProps.showColumnVerticalBorder, gridHasFiller);
            filters.push(<rootProps.slots.headerFilterCell colIndex={columnIndex} key={"".concat(colDef.field, "-filter")} height={headerFilterHeight} width={colDef.computedWidth} colDef={colDef} hasFocus={hasFocus} tabIndex={tabIndex} headerFilterMenuRef={headerFilterMenuRef} headerClassName={headerClassName} data-field={colDef.field} item={item} pinnedPosition={pinnedPosition} pinnedOffset={pinnedOffset} showLeftBorder={showLeftBorder} showRightBorder={showRightBorder} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.headerFilterCell}/>);
        }
        return otherProps.getFillers(params, filters, 0, true);
    };
    var getColumnFiltersRow = function () {
        if (disableHeaderFiltering) {
            return null;
        }
        return (<internals_1.GridColumnHeaderRow ref={headerFiltersRef} className={classes.headerFilterRow} role="row" aria-rowindex={headerGroupingMaxDepth + 2} ownerState={rootProps}>
        {leftRenderContext &&
                getColumnFilters({
                    position: internals_1.PinnedColumnPosition.LEFT,
                    renderContext: leftRenderContext,
                    maxLastColumn: leftRenderContext.lastColumnIndex,
                })}
        {getColumnFilters({
                renderContext: renderContext,
                maxLastColumn: visibleColumns.length - pinnedColumns.right.length,
            })}
        {rightRenderContext &&
                getColumnFilters({
                    position: internals_1.PinnedColumnPosition.RIGHT,
                    renderContext: rightRenderContext,
                    maxLastColumn: rightRenderContext.lastColumnIndex,
                })}
      </internals_1.GridColumnHeaderRow>);
    };
    return __assign(__assign({}, otherProps), { getColumnFiltersRow: getColumnFiltersRow });
};
exports.useGridColumnHeadersPro = useGridColumnHeadersPro;
