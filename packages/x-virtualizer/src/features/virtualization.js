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
exports.Virtualization = exports.EMPTY_RENDER_CONTEXT = void 0;
exports.areRenderContextsEqual = areRenderContextsEqual;
exports.computeOffsetLeft = computeOffsetLeft;
exports.roundToDecimalPlaces = roundToDecimalPlaces;
var React = require("react");
var ReactDOM = require("react-dom");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var useTimeout_1 = require("@mui/utils/useTimeout");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var platform = require("@mui/x-internals/platform");
var useRunOnce_1 = require("@mui/x-internals/useRunOnce");
var useFirstRender_1 = require("@mui/x-internals/useFirstRender");
var store_1 = require("@mui/x-internals/store");
var core_1 = require("../models/core");
var dimensions_1 = require("./dimensions");
var models_1 = require("../models");
/* eslint-disable import/export, @typescript-eslint/no-redeclare */
var clamp = function (value, min, max) { return Math.max(min, Math.min(max, value)); };
var MINIMUM_COLUMN_WIDTH = 50;
var EMPTY_SCROLL_POSITION = { top: 0, left: 0 };
var EMPTY_DETAIL_PANELS = Object.freeze(new Map());
exports.EMPTY_RENDER_CONTEXT = {
    firstRowIndex: 0,
    lastRowIndex: 0,
    firstColumnIndex: 0,
    lastColumnIndex: 0,
};
var selectors = {
    renderContext: (0, store_1.createSelector)(function (state) { return state.virtualization.renderContext; }),
    enabledForRows: (0, store_1.createSelector)(function (state) { return state.virtualization.enabledForRows; }),
    enabledForColumns: (0, store_1.createSelector)(function (state) { return state.virtualization.enabledForColumns; }),
};
exports.Virtualization = {
    initialize: initializeState,
    use: useVirtualization,
    selectors: selectors,
};
function initializeState(params) {
    var _a;
    var state = {
        virtualization: __assign({ enabled: !platform.isJSDOM, enabledForRows: !platform.isJSDOM, enabledForColumns: !platform.isJSDOM, renderContext: exports.EMPTY_RENDER_CONTEXT }, (_a = params.initialState) === null || _a === void 0 ? void 0 : _a.virtualization),
        // FIXME: refactor once the state shape is settled
        getters: null,
    };
    return state;
}
function useVirtualization(store, params, api) {
    var _a;
    var refs = params.refs, _b = params.dimensions, rowHeight = _b.rowHeight, columnsTotalWidth = _b.columnsTotalWidth, _c = params.virtualization, _d = _c.isRtl, isRtl = _d === void 0 ? false : _d, _e = _c.rowBufferPx, rowBufferPx = _e === void 0 ? 150 : _e, _f = _c.columnBufferPx, columnBufferPx = _f === void 0 ? 150 : _f, colspan = params.colspan, initialState = params.initialState, rows = params.rows, range = params.range, columns = params.columns, _g = params.pinnedRows, pinnedRows = _g === void 0 ? core_1.PinnedRows.EMPTY : _g, _h = params.pinnedColumns, pinnedColumns = _h === void 0 ? core_1.PinnedColumns.EMPTY : _h, minimalContentHeight = params.minimalContentHeight, autoHeight = params.autoHeight, onWheel = params.onWheel, onTouchMove = params.onTouchMove, onRenderContextChange = params.onRenderContextChange, onScrollChange = params.onScrollChange, scrollReset = params.scrollReset, renderRow = params.renderRow, renderInfiniteLoadingTrigger = params.renderInfiniteLoadingTrigger;
    var needsHorizontalScrollbar = (0, store_1.useStore)(store, dimensions_1.Dimensions.selectors.needsHorizontalScrollbar);
    var hasBottomPinnedRows = pinnedRows.bottom.length > 0;
    var _j = React.useState(EMPTY_DETAIL_PANELS), panels = _j[0], setPanels = _j[1];
    var _k = React.useState(0), setRefTick = _k[1];
    var isRenderContextReady = React.useRef(false);
    var renderContext = (0, store_1.useStore)(store, selectors.renderContext);
    var enabledForRows = (0, store_1.useStore)(store, selectors.enabledForRows);
    var enabledForColumns = (0, store_1.useStore)(store, selectors.enabledForColumns);
    var rowsMeta = (0, store_1.useStore)(store, dimensions_1.Dimensions.selectors.rowsMeta);
    var contentHeight = (0, store_1.useStore)(store, dimensions_1.Dimensions.selectors.contentHeight);
    /*
     * Scroll context logic
     * ====================
     * We only render the cells contained in the `renderContext`. However, when the user starts scrolling the grid
     * in a direction, we want to render as many cells as possible in that direction, as to avoid presenting white
     * areas if the user scrolls too fast/far and the viewport ends up in a region we haven't rendered yet. To render
     * more cells, we store some offsets to add to the viewport in `scrollCache.buffer`. Those offsets make the render
     * context wider in the direction the user is going, but also makes the buffer around the viewport `0` for the
     * dimension (horizontal or vertical) in which the user is not scrolling. So if the normal viewport is 8 columns
     * wide, with a 1 column buffer (10 columns total), then we want it to be exactly 8 columns wide during vertical
     * scroll.
     * However, we don't want the rows in the old context to re-render from e.g. 10 columns to 8 columns, because that's
     * work that's not necessary. Thus we store the context at the start of the scroll in `frozenContext`, and the rows
     * that are part of this old context will keep their same render context as to avoid re-rendering.
     */
    var scrollPosition = React.useRef((_a = initialState === null || initialState === void 0 ? void 0 : initialState.scroll) !== null && _a !== void 0 ? _a : EMPTY_SCROLL_POSITION);
    var ignoreNextScrollEvent = React.useRef(false);
    var previousContextScrollPosition = React.useRef(EMPTY_SCROLL_POSITION);
    var previousRowContext = React.useRef(exports.EMPTY_RENDER_CONTEXT);
    var scrollTimeout = (0, useTimeout_1.default)();
    var frozenContext = React.useRef(undefined);
    var scrollCache = (0, useLazyRef_1.default)(function () {
        return createScrollCache(isRtl, rowBufferPx, columnBufferPx, rowHeight * 15, MINIMUM_COLUMN_WIDTH * 6);
    }).current;
    var updateRenderContext = React.useCallback(function (nextRenderContext) {
        if (!areRenderContextsEqual(nextRenderContext, store.state.virtualization.renderContext)) {
            store.set('virtualization', __assign(__assign({}, store.state.virtualization), { renderContext: nextRenderContext }));
        }
        // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
        // but only does something if we already have a render context, because
        // otherwise we would call an update directly on mount
        var isReady = dimensions_1.Dimensions.selectors.dimensions(store.state).isReady;
        var didRowsIntervalChange = nextRenderContext.firstRowIndex !== previousRowContext.current.firstRowIndex ||
            nextRenderContext.lastRowIndex !== previousRowContext.current.lastRowIndex;
        if (isReady && didRowsIntervalChange) {
            previousRowContext.current = nextRenderContext;
            onRenderContextChange === null || onRenderContextChange === void 0 ? void 0 : onRenderContextChange(nextRenderContext);
        }
        previousContextScrollPosition.current = scrollPosition.current;
    }, [store, onRenderContextChange]);
    var triggerUpdateRenderContext = (0, useEventCallback_1.default)(function () {
        var scroller = refs.scroller.current;
        if (!scroller) {
            return undefined;
        }
        var dimensions = dimensions_1.Dimensions.selectors.dimensions(store.state);
        var maxScrollTop = Math.ceil(dimensions.minimumSize.height - dimensions.viewportOuterSize.height);
        var maxScrollLeft = Math.ceil(dimensions.minimumSize.width - dimensions.viewportInnerSize.width);
        // Clamp the scroll position to the viewport to avoid re-calculating the render context for scroll bounce
        var newScroll = {
            top: clamp(scroller.scrollTop, 0, maxScrollTop),
            left: isRtl
                ? clamp(scroller.scrollLeft, -maxScrollLeft, 0)
                : clamp(scroller.scrollLeft, 0, maxScrollLeft),
        };
        var dx = newScroll.left - scrollPosition.current.left;
        var dy = newScroll.top - scrollPosition.current.top;
        var isScrolling = dx !== 0 || dy !== 0;
        scrollPosition.current = newScroll;
        var direction = isScrolling ? models_1.ScrollDirection.forDelta(dx, dy) : models_1.ScrollDirection.NONE;
        // Since previous render, we have scrolled...
        var rowScroll = Math.abs(scrollPosition.current.top - previousContextScrollPosition.current.top);
        var columnScroll = Math.abs(scrollPosition.current.left - previousContextScrollPosition.current.left);
        // PERF: use the computed minimum column width instead of a static one
        var didCrossThreshold = rowScroll >= rowHeight || columnScroll >= MINIMUM_COLUMN_WIDTH;
        var didChangeDirection = scrollCache.direction !== direction;
        var shouldUpdate = didCrossThreshold || didChangeDirection;
        if (!shouldUpdate) {
            return renderContext;
        }
        // Render a new context
        if (didChangeDirection) {
            switch (direction) {
                case models_1.ScrollDirection.NONE:
                case models_1.ScrollDirection.LEFT:
                case models_1.ScrollDirection.RIGHT:
                    frozenContext.current = undefined;
                    break;
                default:
                    frozenContext.current = renderContext;
                    break;
            }
        }
        scrollCache.direction = direction;
        scrollCache.buffer = bufferForDirection(isRtl, direction, rowBufferPx, columnBufferPx, rowHeight * 15, MINIMUM_COLUMN_WIDTH * 6);
        var inputs = inputsSelector(store, params, api, enabledForRows, enabledForColumns);
        var nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);
        if (!areRenderContextsEqual(nextRenderContext, renderContext)) {
            // Prevents batching render context changes
            ReactDOM.flushSync(function () {
                updateRenderContext(nextRenderContext);
            });
            scrollTimeout.start(1000, triggerUpdateRenderContext);
        }
        return nextRenderContext;
    });
    var forceUpdateRenderContext = (0, useEventCallback_1.default)(function () {
        // skip update if dimensions are not ready and virtualization is enabled
        if (!dimensions_1.Dimensions.selectors.dimensions(store.state).isReady &&
            (enabledForRows || enabledForColumns)) {
            return;
        }
        var inputs = inputsSelector(store, params, api, enabledForRows, enabledForColumns);
        var nextRenderContext = computeRenderContext(inputs, scrollPosition.current, scrollCache);
        // Reset the frozen context when the render context changes, see the illustration in https://github.com/mui/mui-x/pull/12353
        frozenContext.current = undefined;
        updateRenderContext(nextRenderContext);
    });
    var handleScroll = (0, useEventCallback_1.default)(function () {
        if (ignoreNextScrollEvent.current) {
            ignoreNextScrollEvent.current = false;
            return;
        }
        var nextRenderContext = triggerUpdateRenderContext();
        if (nextRenderContext) {
            onScrollChange === null || onScrollChange === void 0 ? void 0 : onScrollChange(scrollPosition.current, nextRenderContext);
        }
    });
    var getOffsetTop = function () {
        var _a;
        return (_a = rowsMeta.positions[renderContext.firstRowIndex]) !== null && _a !== void 0 ? _a : 0;
    };
    /**
     * HACK: unstable_rowTree fixes the issue described below, but does it by tightly coupling this
     * section of code to the DataGrid's rowTree model. The `unstable_rowTree` param is a temporary
     * solution to decouple the code.
     */
    var getRows = function (rowParams, unstable_rowTree) {
        var _a, _b;
        if (rowParams === void 0) { rowParams = {}; }
        if (!rowParams.rows && !range) {
            return [];
        }
        var baseRenderContext = renderContext;
        if (rowParams.renderContext) {
            baseRenderContext = rowParams.renderContext;
            baseRenderContext.firstColumnIndex = renderContext.firstColumnIndex;
            baseRenderContext.lastColumnIndex = renderContext.lastColumnIndex;
        }
        var isLastSection = (!hasBottomPinnedRows && rowParams.position === undefined) ||
            (hasBottomPinnedRows && rowParams.position === 'bottom');
        var isPinnedSection = rowParams.position !== undefined;
        var rowIndexOffset;
        switch (rowParams.position) {
            case 'top':
                rowIndexOffset = 0;
                break;
            case 'bottom':
                rowIndexOffset = pinnedRows.top.length + rows.length;
                break;
            case undefined:
            default:
                rowIndexOffset = pinnedRows.top.length;
                break;
        }
        var rowModels = (_a = rowParams.rows) !== null && _a !== void 0 ? _a : rows;
        var firstRowToRender = baseRenderContext.firstRowIndex;
        var lastRowToRender = Math.min(baseRenderContext.lastRowIndex, rowModels.length);
        var rowIndexes = rowParams.rows
            ? createRange(0, rowParams.rows.length)
            : createRange(firstRowToRender, lastRowToRender);
        var virtualRowIndex = -1;
        var focusedVirtualCell = (_b = params.focusedVirtualCell) === null || _b === void 0 ? void 0 : _b.call(params);
        if (!isPinnedSection && focusedVirtualCell) {
            if (focusedVirtualCell.rowIndex < firstRowToRender) {
                rowIndexes.unshift(focusedVirtualCell.rowIndex);
                virtualRowIndex = focusedVirtualCell.rowIndex;
            }
            if (focusedVirtualCell.rowIndex > lastRowToRender) {
                rowIndexes.push(focusedVirtualCell.rowIndex);
                virtualRowIndex = focusedVirtualCell.rowIndex;
            }
        }
        var rowElements = [];
        var columnPositions = dimensions_1.Dimensions.selectors.columnPositions(store.state, columns);
        rowIndexes.forEach(function (rowIndexInPage) {
            var _a = rowModels[rowIndexInPage], id = _a.id, model = _a.model;
            // In certain cases, the state might already be updated and `params.rows` (which sets `rowModels`)
            // contains stale data.
            // In that case, skip any further row processing.
            // See:
            // - https://github.com/mui/mui-x/issues/16638
            // - https://github.com/mui/mui-x/issues/17022
            if (unstable_rowTree && !unstable_rowTree[id]) {
                return;
            }
            var rowIndex = ((range === null || range === void 0 ? void 0 : range.firstRowIndex) || 0) + rowIndexOffset + rowIndexInPage;
            // NOTE: This is an expensive feature, the colSpan code could be optimized.
            if (colspan === null || colspan === void 0 ? void 0 : colspan.enabled) {
                var minFirstColumn = pinnedColumns.left.length;
                var maxLastColumn = columns.length - pinnedColumns.right.length;
                api.calculateColSpan(id, minFirstColumn, maxLastColumn, columns);
                if (pinnedColumns.left.length > 0) {
                    api.calculateColSpan(id, 0, pinnedColumns.left.length, columns);
                }
                if (pinnedColumns.right.length > 0) {
                    api.calculateColSpan(id, columns.length - pinnedColumns.right.length, columns.length, columns);
                }
            }
            var baseRowHeight = !api.rowsMeta.rowHasAutoHeight(id)
                ? api.rowsMeta.getRowHeight(id)
                : 'auto';
            var isFirstVisible = false;
            if (rowParams.position === undefined) {
                isFirstVisible = rowIndexInPage === 0;
            }
            var isLastVisible = false;
            var isLastVisibleInSection = rowIndexInPage === rowModels.length - 1;
            if (isLastSection) {
                if (!isPinnedSection) {
                    var lastIndex = rows.length - 1;
                    var isLastVisibleRowIndex = rowIndexInPage === lastIndex;
                    if (isLastVisibleRowIndex) {
                        isLastVisible = true;
                    }
                }
                else {
                    isLastVisible = isLastVisibleInSection;
                }
            }
            var currentRenderContext = baseRenderContext;
            if (frozenContext.current &&
                rowIndexInPage >= frozenContext.current.firstRowIndex &&
                rowIndexInPage < frozenContext.current.lastRowIndex) {
                currentRenderContext = frozenContext.current;
            }
            var isVirtualFocusRow = rowIndexInPage === virtualRowIndex;
            var isVirtualFocusColumn = (focusedVirtualCell === null || focusedVirtualCell === void 0 ? void 0 : focusedVirtualCell.rowIndex) === rowIndex;
            var offsetLeft = computeOffsetLeft(columnPositions, currentRenderContext, pinnedColumns.left.length);
            var showBottomBorder = isLastVisibleInSection && rowParams.position === 'top';
            var firstColumnIndex = currentRenderContext.firstColumnIndex;
            var lastColumnIndex = currentRenderContext.lastColumnIndex;
            rowElements.push(renderRow({
                id: id,
                model: model,
                rowIndex: rowIndex,
                offsetLeft: offsetLeft,
                columnsTotalWidth: columnsTotalWidth,
                baseRowHeight: baseRowHeight,
                firstColumnIndex: firstColumnIndex,
                lastColumnIndex: lastColumnIndex,
                focusedColumnIndex: isVirtualFocusColumn ? focusedVirtualCell.columnIndex : undefined,
                isFirstVisible: isFirstVisible,
                isLastVisible: isLastVisible,
                isVirtualFocusRow: isVirtualFocusRow,
                showBottomBorder: showBottomBorder,
            }));
            if (isVirtualFocusRow) {
                return;
            }
            var panel = panels.get(id);
            if (panel) {
                rowElements.push(panel);
            }
            if (rowParams.position === undefined && isLastVisibleInSection) {
                rowElements.push(renderInfiniteLoadingTrigger(id));
            }
        });
        return rowElements;
    };
    var scrollerStyle = React.useMemo(function () {
        return ({
            overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
            overflowY: autoHeight ? 'hidden' : undefined,
        });
    }, [needsHorizontalScrollbar, autoHeight]);
    var contentSize = React.useMemo(function () {
        var size = {
            width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
            flexBasis: contentHeight,
            flexShrink: 0,
        };
        if (size.flexBasis === 0) {
            size.flexBasis = minimalContentHeight; // Give room to show the overlay when there no rows.
        }
        return size;
    }, [columnsTotalWidth, contentHeight, needsHorizontalScrollbar, minimalContentHeight]);
    var scrollRestoreCallback = React.useRef(null);
    var contentNodeRef = React.useCallback(function (node) {
        var _a;
        if (!node) {
            return;
        }
        (_a = scrollRestoreCallback.current) === null || _a === void 0 ? void 0 : _a.call(scrollRestoreCallback, columnsTotalWidth, contentHeight);
    }, [columnsTotalWidth, contentHeight]);
    (0, useEnhancedEffect_1.default)(function () {
        if (!isRenderContextReady.current) {
            return;
        }
        forceUpdateRenderContext();
    }, [enabledForColumns, enabledForRows, forceUpdateRenderContext]);
    (0, useEnhancedEffect_1.default)(function () {
        if (refs.scroller.current) {
            refs.scroller.current.scrollLeft = 0;
        }
    }, [refs.scroller, scrollReset]);
    (0, useRunOnce_1.useRunOnce)(renderContext !== exports.EMPTY_RENDER_CONTEXT, function () {
        onScrollChange === null || onScrollChange === void 0 ? void 0 : onScrollChange(scrollPosition.current, renderContext);
        isRenderContextReady.current = true;
        if ((initialState === null || initialState === void 0 ? void 0 : initialState.scroll) && refs.scroller.current) {
            var scroller_1 = refs.scroller.current;
            var _a = initialState.scroll, top_1 = _a.top, left_1 = _a.left;
            var isScrollRestored_1 = {
                top: !(top_1 > 0),
                left: !(left_1 > 0),
            };
            if (!isScrollRestored_1.left && columnsTotalWidth) {
                scroller_1.scrollLeft = left_1;
                isScrollRestored_1.left = true;
                ignoreNextScrollEvent.current = true;
            }
            // To restore the vertical scroll, we need to wait until the rows are available in the DOM (otherwise
            // there's nowhere to scroll). We still set the scrollTop to the initial value at this point in case
            // there already are rows rendered in the DOM, but we only confirm `isScrollRestored.top = true` in the
            // asynchronous callback below.
            if (!isScrollRestored_1.top && contentHeight) {
                scroller_1.scrollTop = top_1;
                ignoreNextScrollEvent.current = true;
            }
            if (!isScrollRestored_1.top || !isScrollRestored_1.left) {
                scrollRestoreCallback.current = function (columnsTotalWidthCurrent, contentHeightCurrent) {
                    if (!isScrollRestored_1.left && columnsTotalWidthCurrent) {
                        scroller_1.scrollLeft = left_1;
                        isScrollRestored_1.left = true;
                        ignoreNextScrollEvent.current = true;
                    }
                    if (!isScrollRestored_1.top && contentHeightCurrent) {
                        scroller_1.scrollTop = top_1;
                        isScrollRestored_1.top = true;
                        ignoreNextScrollEvent.current = true;
                    }
                    if (isScrollRestored_1.left && isScrollRestored_1.top) {
                        scrollRestoreCallback.current = null;
                    }
                };
            }
        }
    });
    (0, store_1.useStoreEffect)(store, dimensions_1.Dimensions.selectors.dimensions, forceUpdateRenderContext);
    var refSetter = function (name) { return function (node) {
        if (node && refs[name].current !== node) {
            refs[name].current = node;
            setRefTick(function (tick) { return tick + 1; });
        }
    }; };
    var getters = {
        setPanels: setPanels,
        getOffsetTop: getOffsetTop,
        getRows: getRows,
        getContainerProps: function () { return ({
            ref: refSetter('container'),
        }); },
        getScrollerProps: function () { return ({
            ref: refSetter('scroller'),
            onScroll: handleScroll,
            onWheel: onWheel,
            onTouchMove: onTouchMove,
            style: scrollerStyle,
            role: 'presentation',
            // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
            // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
            tabIndex: platform.isFirefox ? -1 : undefined,
        }); },
        getContentProps: function () { return ({
            ref: contentNodeRef,
            style: contentSize,
            role: 'presentation',
        }); },
        getScrollbarVerticalProps: function () { return ({
            ref: refSetter('scrollbarVertical'),
            scrollPosition: scrollPosition,
        }); },
        getScrollbarHorizontalProps: function () { return ({
            ref: refSetter('scrollbarHorizontal'),
            scrollPosition: scrollPosition,
        }); },
        getScrollAreaProps: function () { return ({
            scrollPosition: scrollPosition,
        }); },
    };
    (0, useFirstRender_1.useFirstRender)(function () {
        store.state = __assign(__assign({}, store.state), { getters: getters });
    });
    React.useEffect(function () {
        store.update({ getters: getters });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, Object.values(getters));
    /* Placeholder API functions for colspan & rowspan to re-implement */
    var getCellColSpanInfo = function () {
        throw new Error('Unimplemented: colspan feature is required');
    };
    var calculateColSpan = function () {
        throw new Error('Unimplemented: colspan feature is required');
    };
    var getHiddenCellsOrigin = function () {
        throw new Error('Unimplemented: rowspan feature is required');
    };
    return {
        getters: getters,
        useVirtualization: function () { return (0, store_1.useStore)(store, function (state) { return state; }); },
        setPanels: setPanels,
        forceUpdateRenderContext: forceUpdateRenderContext,
        getCellColSpanInfo: getCellColSpanInfo,
        calculateColSpan: calculateColSpan,
        getHiddenCellsOrigin: getHiddenCellsOrigin,
    };
}
function inputsSelector(store, params, api, enabledForRows, enabledForColumns) {
    var _a, _b;
    var dimensions = dimensions_1.Dimensions.selectors.dimensions(store.state);
    var rows = params.rows;
    var range = params.range;
    var columns = params.columns;
    var hiddenCellsOriginMap = api.getHiddenCellsOrigin();
    var lastRowId = (_a = params.rows.at(-1)) === null || _a === void 0 ? void 0 : _a.id;
    var lastColumn = columns.at(-1);
    return {
        api: api,
        enabledForRows: enabledForRows,
        enabledForColumns: enabledForColumns,
        autoHeight: params.autoHeight,
        rowBufferPx: params.virtualization.rowBufferPx,
        columnBufferPx: params.virtualization.columnBufferPx,
        leftPinnedWidth: dimensions.leftPinnedWidth,
        columnsTotalWidth: dimensions.columnsTotalWidth,
        viewportInnerWidth: dimensions.viewportInnerSize.width,
        viewportInnerHeight: dimensions.viewportInnerSize.height,
        lastRowHeight: lastRowId !== undefined ? api.rowsMeta.getRowHeight(lastRowId) : 0,
        lastColumnWidth: (_b = lastColumn === null || lastColumn === void 0 ? void 0 : lastColumn.computedWidth) !== null && _b !== void 0 ? _b : 0,
        rowsMeta: dimensions_1.Dimensions.selectors.rowsMeta(store.state),
        columnPositions: dimensions_1.Dimensions.selectors.columnPositions(store.state, params.columns),
        rows: rows,
        range: range,
        pinnedColumns: params.pinnedColumns,
        columns: columns,
        hiddenCellsOriginMap: hiddenCellsOriginMap,
        virtualizeColumnsWithAutoRowHeight: params.virtualizeColumnsWithAutoRowHeight,
    };
}
function computeRenderContext(inputs, scrollPosition, scrollCache) {
    var renderContext = {
        firstRowIndex: 0,
        lastRowIndex: inputs.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: inputs.columns.length,
    };
    var top = scrollPosition.top, left = scrollPosition.left;
    var realLeft = Math.abs(left) + inputs.leftPinnedWidth;
    if (inputs.enabledForRows) {
        // Clamp the value because the search may return an index out of bounds.
        // In the last index, this is not needed because Array.slice doesn't include it.
        var firstRowIndex = Math.min(getNearestIndexToRender(inputs, top, {
            atStart: true,
            lastPosition: inputs.rowsMeta.positions[inputs.rowsMeta.positions.length - 1] + inputs.lastRowHeight,
        }), inputs.rowsMeta.positions.length - 1);
        // If any of the cells in the `firstRowIndex` is hidden due to an extended row span,
        // Make sure the row from where the rowSpan is originated is visible.
        var rowSpanHiddenCellOrigin = inputs.hiddenCellsOriginMap[firstRowIndex];
        if (rowSpanHiddenCellOrigin) {
            var minSpannedRowIndex = Math.min.apply(Math, Object.values(rowSpanHiddenCellOrigin));
            firstRowIndex = Math.min(firstRowIndex, minSpannedRowIndex);
        }
        var lastRowIndex = inputs.autoHeight
            ? firstRowIndex + inputs.rows.length
            : getNearestIndexToRender(inputs, top + inputs.viewportInnerHeight);
        renderContext.firstRowIndex = firstRowIndex;
        renderContext.lastRowIndex = lastRowIndex;
    }
    // XXX
    // if (inputs.listView) {
    //   return {
    //     ...renderContext,
    //     lastColumnIndex: 1,
    //   };
    // }
    if (inputs.enabledForColumns) {
        var firstColumnIndex = 0;
        var lastColumnIndex = inputs.columnPositions.length;
        var hasRowWithAutoHeight = false;
        var _a = getIndexesToRender({
            firstIndex: renderContext.firstRowIndex,
            lastIndex: renderContext.lastRowIndex,
            minFirstIndex: 0,
            maxLastIndex: inputs.rows.length,
            bufferBefore: scrollCache.buffer.rowBefore,
            bufferAfter: scrollCache.buffer.rowAfter,
            positions: inputs.rowsMeta.positions,
            lastSize: inputs.lastRowHeight,
        }), firstRowToRender = _a[0], lastRowToRender = _a[1];
        if (!inputs.virtualizeColumnsWithAutoRowHeight) {
            for (var i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
                var row = inputs.rows[i];
                hasRowWithAutoHeight = inputs.api.rowsMeta.rowHasAutoHeight(row.id);
            }
        }
        if (!hasRowWithAutoHeight || inputs.virtualizeColumnsWithAutoRowHeight) {
            firstColumnIndex = binarySearch(realLeft, inputs.columnPositions, {
                atStart: true,
                lastPosition: inputs.columnsTotalWidth,
            });
            lastColumnIndex = binarySearch(realLeft + inputs.viewportInnerWidth, inputs.columnPositions);
        }
        renderContext.firstColumnIndex = firstColumnIndex;
        renderContext.lastColumnIndex = lastColumnIndex;
    }
    var actualRenderContext = deriveRenderContext(inputs, renderContext, scrollCache);
    return actualRenderContext;
}
function getNearestIndexToRender(inputs, offset, options) {
    var _a, _b;
    var lastMeasuredIndexRelativeToAllRows = inputs.api.rowsMeta.getLastMeasuredRowIndex();
    var allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
    if (((_a = inputs.range) === null || _a === void 0 ? void 0 : _a.lastRowIndex) && !allRowsMeasured) {
        // Check if all rows in this page are already measured
        allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= inputs.range.lastRowIndex;
    }
    var lastMeasuredIndexRelativeToCurrentPage = clamp(lastMeasuredIndexRelativeToAllRows - (((_b = inputs.range) === null || _b === void 0 ? void 0 : _b.firstRowIndex) || 0), 0, inputs.rowsMeta.positions.length);
    if (allRowsMeasured ||
        inputs.rowsMeta.positions[lastMeasuredIndexRelativeToCurrentPage] >= offset) {
        // If all rows were measured (when no row has "auto" as height) or all rows before the offset
        // were measured, then use a binary search because it's faster.
        return binarySearch(offset, inputs.rowsMeta.positions, options);
    }
    // Otherwise, use an exponential search.
    // If rows have "auto" as height, their positions will be based on estimated heights.
    // In this case, we can skip several steps until we find a position higher than the offset.
    // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
    return exponentialSearch(offset, inputs.rowsMeta.positions, lastMeasuredIndexRelativeToCurrentPage, options);
}
/**
 * Accepts as input a raw render context (the area visible in the viewport) and adds
 * computes the actual render context based on pinned elements, buffer dimensions and
 * spanning.
 */
function deriveRenderContext(inputs, nextRenderContext, scrollCache) {
    var _a, _b, _c, _d;
    var _e = getIndexesToRender({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: inputs.rows.length,
        bufferBefore: scrollCache.buffer.rowBefore,
        bufferAfter: scrollCache.buffer.rowAfter,
        positions: inputs.rowsMeta.positions,
        lastSize: inputs.lastRowHeight,
    }), firstRowToRender = _e[0], lastRowToRender = _e[1];
    var _f = getIndexesToRender({
        firstIndex: nextRenderContext.firstColumnIndex,
        lastIndex: nextRenderContext.lastColumnIndex,
        minFirstIndex: (_b = (_a = inputs.pinnedColumns) === null || _a === void 0 ? void 0 : _a.left.length) !== null && _b !== void 0 ? _b : 0,
        maxLastIndex: inputs.columns.length - ((_d = (_c = inputs.pinnedColumns) === null || _c === void 0 ? void 0 : _c.right.length) !== null && _d !== void 0 ? _d : 0),
        bufferBefore: scrollCache.buffer.columnBefore,
        bufferAfter: scrollCache.buffer.columnAfter,
        positions: inputs.columnPositions,
        lastSize: inputs.lastColumnWidth,
    }), initialFirstColumnToRender = _f[0], lastColumnToRender = _f[1];
    var firstColumnToRender = getFirstNonSpannedColumnToRender({
        api: inputs.api,
        firstColumnToRender: initialFirstColumnToRender,
        firstRowToRender: firstRowToRender,
        lastRowToRender: lastRowToRender,
        visibleRows: inputs.rows,
    });
    return {
        firstRowIndex: firstRowToRender,
        lastRowIndex: lastRowToRender,
        firstColumnIndex: firstColumnToRender,
        lastColumnIndex: lastColumnToRender,
    };
}
/**
 * Use binary search to avoid looping through all possible positions.
 * The `options.atStart` provides the possibility to match for the first element that
 * intersects the screen, even if said element's start position is before `offset`. In
 * other words, we search for `offset + width`.
 */
function binarySearch(offset, positions, options, sliceStart, sliceEnd) {
    if (options === void 0) { options = undefined; }
    if (sliceStart === void 0) { sliceStart = 0; }
    if (sliceEnd === void 0) { sliceEnd = positions.length; }
    if (positions.length <= 0) {
        return -1;
    }
    if (sliceStart >= sliceEnd) {
        return sliceStart;
    }
    var pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
    var position = positions[pivot];
    var isBefore;
    if (options === null || options === void 0 ? void 0 : options.atStart) {
        var width = (pivot === positions.length - 1 ? options.lastPosition : positions[pivot + 1]) - position;
        isBefore = offset - width < position;
    }
    else {
        isBefore = offset <= position;
    }
    return isBefore
        ? binarySearch(offset, positions, options, sliceStart, pivot)
        : binarySearch(offset, positions, options, pivot + 1, sliceEnd);
}
function exponentialSearch(offset, positions, index, options) {
    if (options === void 0) { options = undefined; }
    var interval = 1;
    while (index < positions.length && Math.abs(positions[index]) < offset) {
        index += interval;
        interval *= 2;
    }
    return binarySearch(offset, positions, options, Math.floor(index / 2), Math.min(index, positions.length));
}
function getIndexesToRender(_a) {
    var firstIndex = _a.firstIndex, lastIndex = _a.lastIndex, bufferBefore = _a.bufferBefore, bufferAfter = _a.bufferAfter, minFirstIndex = _a.minFirstIndex, maxLastIndex = _a.maxLastIndex, positions = _a.positions, lastSize = _a.lastSize;
    var firstPosition = positions[firstIndex] - bufferBefore;
    var lastPosition = positions[lastIndex] + bufferAfter;
    var firstIndexPadded = binarySearch(firstPosition, positions, {
        atStart: true,
        lastPosition: positions[positions.length - 1] + lastSize,
    });
    var lastIndexPadded = binarySearch(lastPosition, positions);
    return [
        clamp(firstIndexPadded, minFirstIndex, maxLastIndex),
        clamp(lastIndexPadded, minFirstIndex, maxLastIndex),
    ];
}
function areRenderContextsEqual(context1, context2) {
    if (context1 === context2) {
        return true;
    }
    return (context1.firstRowIndex === context2.firstRowIndex &&
        context1.lastRowIndex === context2.lastRowIndex &&
        context1.firstColumnIndex === context2.firstColumnIndex &&
        context1.lastColumnIndex === context2.lastColumnIndex);
}
function computeOffsetLeft(columnPositions, renderContext, pinnedLeftLength) {
    var _a, _b;
    var left = ((_a = columnPositions[renderContext.firstColumnIndex]) !== null && _a !== void 0 ? _a : 0) -
        ((_b = columnPositions[pinnedLeftLength]) !== null && _b !== void 0 ? _b : 0);
    return Math.abs(left);
}
function bufferForDirection(isRtl, direction, rowBufferPx, columnBufferPx, verticalBuffer, horizontalBuffer) {
    if (isRtl) {
        switch (direction) {
            case models_1.ScrollDirection.LEFT:
                direction = models_1.ScrollDirection.RIGHT;
                break;
            case models_1.ScrollDirection.RIGHT:
                direction = models_1.ScrollDirection.LEFT;
                break;
            default:
        }
    }
    switch (direction) {
        case models_1.ScrollDirection.NONE:
            return {
                rowAfter: rowBufferPx,
                rowBefore: rowBufferPx,
                columnAfter: columnBufferPx,
                columnBefore: columnBufferPx,
            };
        case models_1.ScrollDirection.LEFT:
            return {
                rowAfter: 0,
                rowBefore: 0,
                columnAfter: 0,
                columnBefore: horizontalBuffer,
            };
        case models_1.ScrollDirection.RIGHT:
            return {
                rowAfter: 0,
                rowBefore: 0,
                columnAfter: horizontalBuffer,
                columnBefore: 0,
            };
        case models_1.ScrollDirection.UP:
            return {
                rowAfter: 0,
                rowBefore: verticalBuffer,
                columnAfter: 0,
                columnBefore: 0,
            };
        case models_1.ScrollDirection.DOWN:
            return {
                rowAfter: verticalBuffer,
                rowBefore: 0,
                columnAfter: 0,
                columnBefore: 0,
            };
        default:
            // eslint unable to figure out enum exhaustiveness
            throw new Error('unreachable');
    }
}
function createScrollCache(isRtl, rowBufferPx, columnBufferPx, verticalBuffer, horizontalBuffer) {
    return {
        direction: models_1.ScrollDirection.NONE,
        buffer: bufferForDirection(isRtl, models_1.ScrollDirection.NONE, rowBufferPx, columnBufferPx, verticalBuffer, horizontalBuffer),
    };
}
function createRange(from, to) {
    return Array.from({ length: to - from }).map(function (_, i) { return from + i; });
}
function getFirstNonSpannedColumnToRender(_a) {
    var api = _a.api, firstColumnToRender = _a.firstColumnToRender, firstRowToRender = _a.firstRowToRender, lastRowToRender = _a.lastRowToRender, visibleRows = _a.visibleRows;
    var firstNonSpannedColumnToRender = firstColumnToRender;
    var foundStableColumn = false;
    // Keep checking columns until we find one that's not spanned in any visible row
    while (!foundStableColumn && firstNonSpannedColumnToRender >= 0) {
        foundStableColumn = true;
        for (var i = firstRowToRender; i < lastRowToRender; i += 1) {
            var row = visibleRows[i];
            if (row) {
                var rowId = visibleRows[i].id;
                var cellColSpanInfo = api.getCellColSpanInfo(rowId, firstNonSpannedColumnToRender);
                if (cellColSpanInfo &&
                    cellColSpanInfo.spannedByColSpan &&
                    cellColSpanInfo.leftVisibleCellIndex < firstNonSpannedColumnToRender) {
                    firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
                    foundStableColumn = false;
                    break; // Check the new column index against the visible rows, because it might be spanned
                }
            }
        }
    }
    return firstNonSpannedColumnToRender;
}
function roundToDecimalPlaces(value, decimals) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
