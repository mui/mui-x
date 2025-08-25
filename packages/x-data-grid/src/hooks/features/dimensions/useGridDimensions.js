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
exports.dimensionsStateInitializer = void 0;
exports.useGridDimensions = useGridDimensions;
var React = require("react");
var store_1 = require("@mui/x-internals/store");
var useGridEvent_1 = require("../../utils/useGridEvent");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var createSelector_1 = require("../../../utils/createSelector");
var useGridLogger_1 = require("../../utils/useGridLogger");
var columns_1 = require("../columns");
var gridDimensionsSelectors_1 = require("./gridDimensionsSelectors");
var density_1 = require("../density");
var gridRowsUtils_1 = require("../rows/gridRowsUtils");
var gridColumnsUtils_1 = require("../columns/gridColumnsUtils");
var dataGridPropsDefaultValues_1 = require("../../../constants/dataGridPropsDefaultValues");
var roundToDecimalPlaces_1 = require("../../../utils/roundToDecimalPlaces");
var isJSDOM_1 = require("../../../utils/isJSDOM");
var EMPTY_SIZE = { width: 0, height: 0 };
var EMPTY_DIMENSIONS = {
    isReady: false,
    root: EMPTY_SIZE,
    viewportOuterSize: EMPTY_SIZE,
    viewportInnerSize: EMPTY_SIZE,
    contentSize: EMPTY_SIZE,
    minimumSize: EMPTY_SIZE,
    hasScrollX: false,
    hasScrollY: false,
    scrollbarSize: 0,
    headerHeight: 0,
    groupHeaderHeight: 0,
    headerFilterHeight: 0,
    rowWidth: 0,
    rowHeight: 0,
    columnsTotalWidth: 0,
    leftPinnedWidth: 0,
    rightPinnedWidth: 0,
    headersTotalHeight: 0,
    topContainerHeight: 0,
    bottomContainerHeight: 0,
};
var dimensionsStateInitializer = function (state, props, apiRef) {
    var dimensions = EMPTY_DIMENSIONS;
    var density = (0, density_1.gridDensityFactorSelector)(apiRef);
    return __assign(__assign({}, state), { dimensions: __assign(__assign({}, dimensions), getStaticDimensions(props, apiRef, density, (0, columns_1.gridVisiblePinnedColumnDefinitionsSelector)(apiRef))) });
};
exports.dimensionsStateInitializer = dimensionsStateInitializer;
var columnsTotalWidthSelector = (0, createSelector_1.createSelector)(columns_1.gridVisibleColumnDefinitionsSelector, columns_1.gridColumnPositionsSelector, function (visibleColumns, positions) {
    var colCount = visibleColumns.length;
    if (colCount === 0) {
        return 0;
    }
    return (0, roundToDecimalPlaces_1.roundToDecimalPlaces)(positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth, 1);
});
function useGridDimensions(apiRef, props) {
    var virtualizer = apiRef.current.virtualizer;
    var updateDimensions = virtualizer.api.updateDimensions;
    var getViewportPageSize = virtualizer.api.getViewportPageSize;
    var getRootDimensions = React.useCallback(function () { return (0, gridDimensionsSelectors_1.gridDimensionsSelector)(apiRef); }, [apiRef]);
    var apiPublic = {
        getRootDimensions: getRootDimensions,
    };
    var apiPrivate = {
        updateDimensions: updateDimensions,
        getViewportPageSize: getViewportPageSize,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, apiPublic, 'public');
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, apiPrivate, 'private');
    var handleRootMount = function (root) {
        setCSSVariables(root, (0, gridDimensionsSelectors_1.gridDimensionsSelector)(apiRef));
    };
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'rootMount', handleRootMount);
    (0, useGridEvent_1.useGridEventPriority)(apiRef, 'debouncedResize', props.onResize);
    if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable react-hooks/rules-of-hooks */
        var logger_1 = (0, useGridLogger_1.useGridLogger)(apiRef, 'useResizeContainer');
        var errorShown_1 = React.useRef(false);
        (0, useGridEvent_1.useGridEventPriority)(apiRef, 'resize', function (size) {
            if (!getRootDimensions().isReady) {
                return;
            }
            if (size.height === 0 && !errorShown_1.current && !props.autoHeight && !isJSDOM_1.isJSDOM) {
                logger_1.error([
                    'The parent DOM element of the Data Grid has an empty height.',
                    'Please make sure that this element has an intrinsic height.',
                    'The grid displays with a height of 0px.',
                    '',
                    'More details: https://mui.com/r/x-data-grid-no-dimensions.',
                ].join('\n'));
                errorShown_1.current = true;
            }
            if (size.width === 0 && !errorShown_1.current && !isJSDOM_1.isJSDOM) {
                logger_1.error([
                    'The parent DOM element of the Data Grid has an empty width.',
                    'Please make sure that this element has an intrinsic width.',
                    'The grid displays with a width of 0px.',
                    '',
                    'More details: https://mui.com/r/x-data-grid-no-dimensions.',
                ].join('\n'));
                errorShown_1.current = true;
            }
        });
        /* eslint-enable react-hooks/rules-of-hooks */
    }
    (0, store_1.useStoreEffect)(apiRef.current.store, function (s) { return s.dimensions; }, function (previous, next) {
        if (apiRef.current.rootElementRef.current) {
            setCSSVariables(apiRef.current.rootElementRef.current, next);
        }
        if (!areElementSizesEqual(next.viewportInnerSize, previous.viewportInnerSize)) {
            apiRef.current.publishEvent('viewportInnerSizeChange', next.viewportInnerSize);
        }
        apiRef.current.publishEvent('debouncedResize', next.root);
    });
}
function setCSSVariables(root, dimensions) {
    var set = function (k, v) { return root.style.setProperty(k, v); };
    set('--DataGrid-hasScrollX', "".concat(Number(dimensions.hasScrollX)));
    set('--DataGrid-hasScrollY', "".concat(Number(dimensions.hasScrollY)));
    set('--DataGrid-scrollbarSize', "".concat(dimensions.scrollbarSize, "px"));
    set('--DataGrid-rowWidth', "".concat(dimensions.rowWidth, "px"));
    set('--DataGrid-columnsTotalWidth', "".concat(dimensions.columnsTotalWidth, "px"));
    set('--DataGrid-leftPinnedWidth', "".concat(dimensions.leftPinnedWidth, "px"));
    set('--DataGrid-rightPinnedWidth', "".concat(dimensions.rightPinnedWidth, "px"));
    set('--DataGrid-headerHeight', "".concat(dimensions.headerHeight, "px"));
    set('--DataGrid-headersTotalHeight', "".concat(dimensions.headersTotalHeight, "px"));
    set('--DataGrid-topContainerHeight', "".concat(dimensions.topContainerHeight, "px"));
    set('--DataGrid-bottomContainerHeight', "".concat(dimensions.bottomContainerHeight, "px"));
    set('--height', "".concat(dimensions.rowHeight, "px"));
}
function getStaticDimensions(props, apiRef, density, pinnedColumnns) {
    var _a, _b;
    var validRowHeight = (0, gridRowsUtils_1.getValidRowHeight)(props.rowHeight, dataGridPropsDefaultValues_1.DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight, gridRowsUtils_1.rowHeightWarning);
    return {
        rowHeight: Math.floor(validRowHeight * density),
        headerHeight: Math.floor(props.columnHeaderHeight * density),
        groupHeaderHeight: Math.floor(((_a = props.columnGroupHeaderHeight) !== null && _a !== void 0 ? _a : props.columnHeaderHeight) * density),
        headerFilterHeight: Math.floor(((_b = props.headerFilterHeight) !== null && _b !== void 0 ? _b : props.columnHeaderHeight) * density),
        columnsTotalWidth: columnsTotalWidthSelector(apiRef),
        headersTotalHeight: (0, gridColumnsUtils_1.getTotalHeaderHeight)(apiRef, props),
        leftPinnedWidth: pinnedColumnns.left.reduce(function (w, col) { return w + col.computedWidth; }, 0),
        rightPinnedWidth: pinnedColumnns.right.reduce(function (w, col) { return w + col.computedWidth; }, 0),
    };
}
function areElementSizesEqual(a, b) {
    return a.width === b.width && a.height === b.height;
}
