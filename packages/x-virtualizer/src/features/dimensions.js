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
exports.Dimensions = void 0;
var React = require("react");
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var useLazyRef_1 = require("@mui/utils/useLazyRef");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var throttle_1 = require("@mui/x-internals/throttle");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var math_1 = require("@mui/x-internals/math");
var store_1 = require("@mui/x-internals/store");
var models_1 = require("../models");
var EMPTY_DIMENSIONS = {
    isReady: false,
    root: models_1.Size.EMPTY,
    viewportOuterSize: models_1.Size.EMPTY,
    viewportInnerSize: models_1.Size.EMPTY,
    contentSize: models_1.Size.EMPTY,
    minimumSize: models_1.Size.EMPTY,
    hasScrollX: false,
    hasScrollY: false,
    scrollbarSize: 0,
    rowWidth: 0,
    rowHeight: 0,
    columnsTotalWidth: 0,
    leftPinnedWidth: 0,
    rightPinnedWidth: 0,
    topContainerHeight: 0,
    bottomContainerHeight: 0,
};
var selectors = {
    rootSize: function (state) { return state.rootSize; },
    dimensions: function (state) { return state.dimensions; },
    rowHeight: function (state) { return state.dimensions.rowHeight; },
    contentHeight: function (state) { return state.dimensions.contentSize.height; },
    rowsMeta: function (state) { return state.rowsMeta; },
    columnPositions: (0, store_1.createSelectorMemoized)(function (_, columns) {
        var positions = [];
        var currentPosition = 0;
        for (var i = 0; i < columns.length; i += 1) {
            positions.push(currentPosition);
            currentPosition += columns[i].computedWidth;
        }
        return positions;
    }),
    needsHorizontalScrollbar: function (state) {
        return state.dimensions.viewportOuterSize.width > 0 &&
            state.dimensions.columnsTotalWidth > state.dimensions.viewportOuterSize.width;
    },
};
exports.Dimensions = {
    initialize: initializeState,
    use: useDimensions,
    selectors: selectors,
};
function initializeState(params) {
    var dimensions = __assign(__assign({}, EMPTY_DIMENSIONS), params.dimensions);
    var rowCount = params.rowCount;
    var rowHeight = dimensions.rowHeight;
    var rowsMeta = {
        currentPageTotalHeight: rowCount * rowHeight,
        positions: Array.from({ length: rowCount }, function (_, i) { return i * rowHeight; }),
        pinnedTopRowsTotalHeight: 0,
        pinnedBottomRowsTotalHeight: 0,
    };
    var rowHeights = new Map();
    return {
        rootSize: models_1.Size.EMPTY,
        dimensions: dimensions,
        rowsMeta: rowsMeta,
        rowHeights: rowHeights,
    };
}
function useDimensions(store, params, _api) {
    var isFirstSizing = React.useRef(true);
    var refs = params.refs, _a = params.dimensions, rowHeight = _a.rowHeight, columnsTotalWidth = _a.columnsTotalWidth, leftPinnedWidth = _a.leftPinnedWidth, rightPinnedWidth = _a.rightPinnedWidth, topPinnedHeight = _a.topPinnedHeight, bottomPinnedHeight = _a.bottomPinnedHeight, onResize = params.onResize;
    var containerNode = refs.container.current;
    var updateDimensions = React.useCallback(function () {
        if (isFirstSizing.current) {
            return;
        }
        var rootSize = selectors.rootSize(store.state);
        var rowsMeta = selectors.rowsMeta(store.state);
        // All the floating point dimensions should be rounded to .1 decimal places to avoid subpixel rendering issues
        // https://github.com/mui/mui-x/issues/9550#issuecomment-1619020477
        // https://github.com/mui/mui-x/issues/15721
        var scrollbarSize = measureScrollbarSize(containerNode, params.dimensions.scrollbarSize);
        var topContainerHeight = topPinnedHeight + rowsMeta.pinnedTopRowsTotalHeight;
        var bottomContainerHeight = bottomPinnedHeight + rowsMeta.pinnedBottomRowsTotalHeight;
        var contentSize = {
            width: columnsTotalWidth,
            height: (0, math_1.roundToDecimalPlaces)(rowsMeta.currentPageTotalHeight, 1),
        };
        var viewportOuterSize;
        var viewportInnerSize;
        var hasScrollX = false;
        var hasScrollY = false;
        if (params.autoHeight) {
            hasScrollY = false;
            hasScrollX = Math.round(columnsTotalWidth) > Math.round(rootSize.width);
            viewportOuterSize = {
                width: rootSize.width,
                height: topContainerHeight + bottomContainerHeight + contentSize.height,
            };
            viewportInnerSize = {
                width: Math.max(0, viewportOuterSize.width - (hasScrollY ? scrollbarSize : 0)),
                height: Math.max(0, viewportOuterSize.height - (hasScrollX ? scrollbarSize : 0)),
            };
        }
        else {
            viewportOuterSize = {
                width: rootSize.width,
                height: rootSize.height,
            };
            viewportInnerSize = {
                width: Math.max(0, viewportOuterSize.width),
                height: Math.max(0, viewportOuterSize.height - topContainerHeight - bottomContainerHeight),
            };
            var content = contentSize;
            var container = viewportInnerSize;
            var hasScrollXIfNoYScrollBar = content.width > container.width;
            var hasScrollYIfNoXScrollBar = content.height > container.height;
            if (hasScrollXIfNoYScrollBar || hasScrollYIfNoXScrollBar) {
                hasScrollY = hasScrollYIfNoXScrollBar;
                hasScrollX = content.width + (hasScrollY ? scrollbarSize : 0) > container.width;
                // We recalculate the scroll y to consider the size of the x scrollbar.
                if (hasScrollX) {
                    hasScrollY = content.height + scrollbarSize > container.height;
                }
            }
            if (hasScrollY) {
                viewportInnerSize.width -= scrollbarSize;
            }
            if (hasScrollX) {
                viewportInnerSize.height -= scrollbarSize;
            }
        }
        var rowWidth = Math.max(viewportOuterSize.width, columnsTotalWidth + (hasScrollY ? scrollbarSize : 0));
        var minimumSize = {
            width: columnsTotalWidth,
            height: topContainerHeight + contentSize.height + bottomContainerHeight,
        };
        var newDimensions = {
            isReady: true,
            root: rootSize,
            viewportOuterSize: viewportOuterSize,
            viewportInnerSize: viewportInnerSize,
            contentSize: contentSize,
            minimumSize: minimumSize,
            hasScrollX: hasScrollX,
            hasScrollY: hasScrollY,
            scrollbarSize: scrollbarSize,
            rowWidth: rowWidth,
            rowHeight: rowHeight,
            columnsTotalWidth: columnsTotalWidth,
            leftPinnedWidth: leftPinnedWidth,
            rightPinnedWidth: rightPinnedWidth,
            topContainerHeight: topContainerHeight,
            bottomContainerHeight: bottomContainerHeight,
        };
        var prevDimensions = store.state.dimensions;
        if ((0, isDeepEqual_1.isDeepEqual)(prevDimensions, newDimensions)) {
            return;
        }
        store.update({ dimensions: newDimensions });
        onResize === null || onResize === void 0 ? void 0 : onResize(newDimensions.root);
    }, [
        store,
        containerNode,
        params.dimensions.scrollbarSize,
        params.autoHeight,
        onResize,
        rowHeight,
        columnsTotalWidth,
        leftPinnedWidth,
        rightPinnedWidth,
        topPinnedHeight,
        bottomPinnedHeight,
    ]);
    var resizeThrottleMs = params.resizeThrottleMs;
    var updateDimensionCallback = (0, useEventCallback_1.default)(updateDimensions);
    var debouncedUpdateDimensions = React.useMemo(function () { return (resizeThrottleMs > 0 ? (0, throttle_1.throttle)(updateDimensionCallback, resizeThrottleMs) : undefined); }, [resizeThrottleMs, updateDimensionCallback]);
    React.useEffect(function () { return debouncedUpdateDimensions === null || debouncedUpdateDimensions === void 0 ? void 0 : debouncedUpdateDimensions.clear; }, [debouncedUpdateDimensions]);
    var setRootSize = (0, useEventCallback_1.default)(function (rootSize) {
        store.state.rootSize = rootSize;
        if (isFirstSizing.current || !debouncedUpdateDimensions) {
            // We want to initialize the grid dimensions as soon as possible to avoid flickering
            isFirstSizing.current = false;
            updateDimensions();
        }
        else {
            debouncedUpdateDimensions();
        }
    });
    (0, useEnhancedEffect_1.default)(function () { return observeRootNode(containerNode, store, setRootSize); }, [containerNode, store, setRootSize]);
    (0, useEnhancedEffect_1.default)(updateDimensions, [updateDimensions]);
    var rowsMeta = useRowsMeta(store, params, updateDimensions);
    return {
        updateDimensions: updateDimensions,
        debouncedUpdateDimensions: debouncedUpdateDimensions,
        rowsMeta: rowsMeta,
    };
}
function useRowsMeta(store, params, updateDimensions) {
    var heightCache = store.state.rowHeights;
    var rows = params.rows, getRowHeightProp = params.getRowHeight, getRowSpacing = params.getRowSpacing, getEstimatedRowHeight = params.getEstimatedRowHeight;
    var lastMeasuredRowIndex = React.useRef(-1);
    var hasRowWithAutoHeight = React.useRef(false);
    var isHeightMetaValid = React.useRef(false);
    var pinnedRows = params.pinnedRows;
    var rowHeight = (0, store_1.useStore)(store, selectors.rowHeight);
    var getRowHeightEntry = (0, useEventCallback_1.default)(function (rowId) {
        var entry = heightCache.get(rowId);
        if (entry === undefined) {
            entry = {
                content: store.state.dimensions.rowHeight,
                spacingTop: 0,
                spacingBottom: 0,
                detail: 0,
                autoHeight: false,
                needsFirstMeasurement: true,
            };
            heightCache.set(rowId, entry);
        }
        return entry;
    });
    var applyRowHeight = params.applyRowHeight;
    var processHeightEntry = React.useCallback(function (row) {
        var _a, _b;
        // HACK: rowHeight trails behind the most up-to-date value just enough to
        // mess the initial rowsMeta hydration :/
        eslintUseValue(rowHeight);
        var dimensions = selectors.dimensions(store.state);
        var baseRowHeight = dimensions.rowHeight;
        var entry = getRowHeightEntry(row.id);
        if (!getRowHeightProp) {
            entry.content = baseRowHeight;
            entry.needsFirstMeasurement = false;
        }
        else {
            var rowHeightFromUser = getRowHeightProp(row);
            if (rowHeightFromUser === 'auto') {
                if (entry.needsFirstMeasurement) {
                    var estimatedRowHeight = getEstimatedRowHeight
                        ? getEstimatedRowHeight(row)
                        : baseRowHeight;
                    // If the row was not measured yet use the estimated row height
                    entry.content = estimatedRowHeight !== null && estimatedRowHeight !== void 0 ? estimatedRowHeight : baseRowHeight;
                }
                hasRowWithAutoHeight.current = true;
                entry.autoHeight = true;
            }
            else {
                // Default back to base rowHeight if getRowHeight returns null value.
                entry.content = rowHeightFromUser !== null && rowHeightFromUser !== void 0 ? rowHeightFromUser : dimensions.rowHeight;
                entry.needsFirstMeasurement = false;
                entry.autoHeight = false;
            }
        }
        if (getRowSpacing) {
            var spacing = getRowSpacing(row);
            entry.spacingTop = (_a = spacing.top) !== null && _a !== void 0 ? _a : 0;
            entry.spacingBottom = (_b = spacing.bottom) !== null && _b !== void 0 ? _b : 0;
        }
        else {
            entry.spacingTop = 0;
            entry.spacingBottom = 0;
        }
        applyRowHeight === null || applyRowHeight === void 0 ? void 0 : applyRowHeight(entry, row);
        return entry;
    }, [
        store,
        getRowHeightProp,
        getRowHeightEntry,
        getEstimatedRowHeight,
        rowHeight,
        getRowSpacing,
        applyRowHeight,
    ]);
    var hydrateRowsMeta = React.useCallback(function () {
        var _a, _b;
        hasRowWithAutoHeight.current = false;
        var pinnedTopRowsTotalHeight = (_a = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.top.reduce(function (acc, row) {
            var entry = processHeightEntry(row);
            return acc + entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;
        }, 0)) !== null && _a !== void 0 ? _a : 0;
        var pinnedBottomRowsTotalHeight = (_b = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom.reduce(function (acc, row) {
            var entry = processHeightEntry(row);
            return acc + entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;
        }, 0)) !== null && _b !== void 0 ? _b : 0;
        var positions = [];
        var currentPageTotalHeight = rows.reduce(function (acc, row) {
            positions.push(acc);
            var entry = processHeightEntry(row);
            var total = entry.content + entry.spacingTop + entry.spacingBottom + entry.detail;
            return acc + total;
        }, 0);
        if (!hasRowWithAutoHeight.current) {
            // No row has height=auto, so all rows are already measured
            lastMeasuredRowIndex.current = Infinity;
        }
        var didHeightsChange = pinnedTopRowsTotalHeight !== store.state.rowsMeta.pinnedTopRowsTotalHeight ||
            pinnedBottomRowsTotalHeight !== store.state.rowsMeta.pinnedBottomRowsTotalHeight ||
            currentPageTotalHeight !== store.state.rowsMeta.currentPageTotalHeight;
        var rowsMeta = {
            currentPageTotalHeight: currentPageTotalHeight,
            positions: positions,
            pinnedTopRowsTotalHeight: pinnedTopRowsTotalHeight,
            pinnedBottomRowsTotalHeight: pinnedBottomRowsTotalHeight,
        };
        store.set('rowsMeta', rowsMeta);
        if (didHeightsChange) {
            updateDimensions();
        }
        isHeightMetaValid.current = true;
    }, [store, pinnedRows, rows, processHeightEntry, updateDimensions]);
    var hydrateRowsMetaLatest = (0, useEventCallback_1.default)(hydrateRowsMeta);
    var getRowHeight = function (rowId) {
        var _a, _b;
        return (_b = (_a = heightCache.get(rowId)) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : selectors.rowHeight(store.state);
    };
    var storeRowHeightMeasurement = function (id, height) {
        var entry = getRowHeightEntry(id);
        var didChange = entry.content !== height;
        entry.needsFirstMeasurement = false;
        entry.content = height;
        isHeightMetaValid.current && (isHeightMetaValid.current = !didChange);
    };
    var rowHasAutoHeight = function (id) {
        var _a, _b;
        return (_b = (_a = heightCache.get(id)) === null || _a === void 0 ? void 0 : _a.autoHeight) !== null && _b !== void 0 ? _b : false;
    };
    var getLastMeasuredRowIndex = function () {
        return lastMeasuredRowIndex.current;
    };
    var setLastMeasuredRowIndex = function (index) {
        if (hasRowWithAutoHeight.current && index > lastMeasuredRowIndex.current) {
            lastMeasuredRowIndex.current = index;
        }
    };
    var resetRowHeights = function () {
        heightCache.clear();
        hydrateRowsMeta();
    };
    var resizeObserver = (0, useLazyRef_1.default)(function () {
        return typeof ResizeObserver === 'undefined'
            ? undefined
            : new ResizeObserver(function (entries) {
                var _a, _b;
                for (var i = 0; i < entries.length; i += 1) {
                    var entry = entries[i];
                    var height = entry.borderBoxSize && entry.borderBoxSize.length > 0
                        ? entry.borderBoxSize[0].blockSize
                        : entry.contentRect.height;
                    var rowId = entry.target.__mui_id;
                    var focusedVirtualRowId = (_b = (_a = params.focusedVirtualCell) === null || _a === void 0 ? void 0 : _a.call(params)) === null || _b === void 0 ? void 0 : _b.id;
                    if (focusedVirtualRowId === rowId && height === 0) {
                        // Focused virtual row has 0 height.
                        // We don't want to store it to avoid scroll jumping.
                        // https://github.com/mui/mui-x/issues/14726
                        return;
                    }
                    storeRowHeightMeasurement(rowId, height);
                }
                if (!isHeightMetaValid.current) {
                    // Avoids "ResizeObserver loop completed with undelivered notifications" error
                    requestAnimationFrame(function () {
                        hydrateRowsMetaLatest();
                    });
                }
            });
    }).current;
    var observeRowHeight = function (element, rowId) {
        element.__mui_id = rowId;
        resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.observe(element);
        return function () { return resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.unobserve(element); };
    };
    // The effect is used to build the rows meta data - currentPageTotalHeight and positions.
    // Because of variable row height this is needed for the virtualization
    (0, useEnhancedEffect_1.default)(function () {
        hydrateRowsMeta();
    }, [hydrateRowsMeta]);
    return {
        getRowHeight: getRowHeight,
        setLastMeasuredRowIndex: setLastMeasuredRowIndex,
        storeRowHeightMeasurement: storeRowHeightMeasurement,
        hydrateRowsMeta: hydrateRowsMeta,
        observeRowHeight: observeRowHeight,
        rowHasAutoHeight: rowHasAutoHeight,
        getRowHeightEntry: getRowHeightEntry,
        getLastMeasuredRowIndex: getLastMeasuredRowIndex,
        resetRowHeights: resetRowHeights,
    };
}
function observeRootNode(node, store, setRootSize) {
    if (!node) {
        return undefined;
    }
    var bounds = node.getBoundingClientRect();
    var initialSize = {
        width: (0, math_1.roundToDecimalPlaces)(bounds.width, 1),
        height: (0, math_1.roundToDecimalPlaces)(bounds.height, 1),
    };
    if (store.state.rootSize === models_1.Size.EMPTY || !models_1.Size.equals(initialSize, store.state.rootSize)) {
        setRootSize(initialSize);
    }
    if (typeof ResizeObserver === 'undefined') {
        return undefined;
    }
    var observer = new ResizeObserver(function (_a) {
        var entry = _a[0];
        if (!entry) {
            return;
        }
        var rootSize = {
            width: (0, math_1.roundToDecimalPlaces)(entry.contentRect.width, 1),
            height: (0, math_1.roundToDecimalPlaces)(entry.contentRect.height, 1),
        };
        if (!models_1.Size.equals(rootSize, store.state.rootSize)) {
            setRootSize(rootSize);
        }
    });
    observer.observe(node);
    return function () {
        observer.disconnect();
    };
}
var scrollbarSizeCache = new WeakMap();
function measureScrollbarSize(element, scrollbarSize) {
    if (scrollbarSize !== undefined) {
        return scrollbarSize;
    }
    if (element === null) {
        return 0;
    }
    var cachedSize = scrollbarSizeCache.get(element);
    if (cachedSize !== undefined) {
        return cachedSize;
    }
    var doc = (0, ownerDocument_1.default)(element);
    var scrollDiv = doc.createElement('div');
    scrollDiv.style.width = '99px';
    scrollDiv.style.height = '99px';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.className = 'scrollDiv';
    element.appendChild(scrollDiv);
    var size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    element.removeChild(scrollDiv);
    scrollbarSizeCache.set(element, size);
    return size;
}
function eslintUseValue(_) { }
