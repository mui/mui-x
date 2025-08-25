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
exports.GridScrollArea = void 0;
/* eslint-disable @typescript-eslint/no-use-before-define */
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var composeClasses_1 = require("@mui/utils/composeClasses");
var system_1 = require("@mui/system");
var fastMemo_1 = require("@mui/x-internals/fastMemo");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var constants_1 = require("../constants");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var useGridEvent_1 = require("../hooks/utils/useGridEvent");
var useGridSelector_1 = require("../hooks/utils/useGridSelector");
var gridDimensionsSelectors_1 = require("../hooks/features/dimensions/gridDimensionsSelectors");
var densitySelector_1 = require("../hooks/features/density/densitySelector");
var useTimeout_1 = require("../hooks/utils/useTimeout");
var gridColumnsUtils_1 = require("../hooks/features/columns/gridColumnsUtils");
var createSelector_1 = require("../utils/createSelector");
var gridRowsMetaSelector_1 = require("../hooks/features/rows/gridRowsMetaSelector");
var CLIFF = 1;
var SLOP = 1.5;
var useUtilityClasses = function (ownerState) {
    var scrollDirection = ownerState.scrollDirection, classes = ownerState.classes;
    var slots = {
        root: ['scrollArea', "scrollArea--".concat(scrollDirection)],
    };
    return (0, composeClasses_1.default)(slots, constants_1.getDataGridUtilityClass, classes);
};
var GridScrollAreaRawRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ScrollArea',
    overridesResolver: function (props, styles) {
        var _a, _b, _c, _d;
        return [
            (_a = {}, _a["&.".concat(constants_1.gridClasses['scrollArea--left'])] = styles['scrollArea--left'], _a),
            (_b = {}, _b["&.".concat(constants_1.gridClasses['scrollArea--right'])] = styles['scrollArea--right'], _b),
            (_c = {}, _c["&.".concat(constants_1.gridClasses['scrollArea--up'])] = styles['scrollArea--up'], _c),
            (_d = {}, _d["&.".concat(constants_1.gridClasses['scrollArea--down'])] = styles['scrollArea--down'], _d),
            styles.scrollArea,
        ];
    },
})(function () {
    var _a;
    return (_a = {
            position: 'absolute',
            zIndex: 101
        },
        // Horizontal scroll areas
        _a["&.".concat(constants_1.gridClasses['scrollArea--left'])] = {
            top: 0,
            left: 0,
            width: 20,
            bottom: 0,
        },
        _a["&.".concat(constants_1.gridClasses['scrollArea--right'])] = {
            top: 0,
            right: 0,
            width: 20,
            bottom: 0,
        },
        // Vertical scroll areas
        _a["&.".concat(constants_1.gridClasses['scrollArea--up'])] = {
            top: 0,
            left: 0,
            right: 0,
            height: 20,
        },
        _a["&.".concat(constants_1.gridClasses['scrollArea--down'])] = {
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
        },
        _a);
});
var offsetSelector = (0, createSelector_1.createSelector)(gridDimensionsSelectors_1.gridDimensionsSelector, function (dimensions, direction) {
    if (direction === 'left') {
        return dimensions.leftPinnedWidth;
    }
    if (direction === 'right') {
        return dimensions.rightPinnedWidth + (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);
    }
    // For vertical scroll areas, we don't need horizontal offset
    return 0;
});
function GridScrollAreaWrapper(props) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var _a = React.useState('none'), dragDirection = _a[0], setDragDirection = _a[1];
    // Listen for both column and row drag events
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderDragStart', function () { return setDragDirection('horizontal'); });
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderDragEnd', function () { return setDragDirection('none'); });
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowDragStart', function () { return setDragDirection('vertical'); });
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowDragEnd', function () { return setDragDirection('none'); });
    if (dragDirection === 'none') {
        return null;
    }
    if (dragDirection === 'horizontal') {
        return <GridHorizontalScrollAreaContent {...props}/>;
    }
    return <GridVerticalScrollAreaContent {...props}/>;
}
function GridHorizontalScrollAreaContent(props) {
    var scrollDirection = props.scrollDirection, scrollPosition = props.scrollPosition;
    var rootRef = React.useRef(null);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var timeout = (0, useTimeout_1.useTimeout)();
    var densityFactor = (0, useGridSelector_1.useGridSelector)(apiRef, densitySelector_1.gridDensityFactorSelector);
    var columnsTotalWidth = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridColumnsTotalWidthSelector);
    var sideOffset = (0, useGridSelector_1.useGridSelector)(apiRef, offsetSelector, scrollDirection);
    var getCanScrollMore = function () {
        var dimensions = (0, gridDimensionsSelectors_1.gridDimensionsSelector)(apiRef);
        if (scrollDirection === 'left') {
            // Only render if the user has not reached yet the start of the list
            return scrollPosition.current.left > 0;
        }
        if (scrollDirection === 'right') {
            // Only render if the user has not reached yet the end of the list
            var maxScrollLeft = columnsTotalWidth - dimensions.viewportInnerSize.width;
            return scrollPosition.current.left < maxScrollLeft;
        }
        return false;
    };
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var totalHeaderHeight = (0, gridColumnsUtils_1.getTotalHeaderHeight)(apiRef, rootProps);
    var headerHeight = Math.floor(rootProps.columnHeaderHeight * densityFactor);
    var style = __assign(__assign({ height: headerHeight, top: totalHeaderHeight - headerHeight }, (scrollDirection === 'left' ? { left: sideOffset } : {})), (scrollDirection === 'right' ? { right: sideOffset } : {}));
    var handleDragOver = (0, useEventCallback_1.default)(function (event) {
        var offset;
        // Prevents showing the forbidden cursor
        event.preventDefault();
        if (scrollDirection === 'left') {
            offset = event.clientX - rootRef.current.getBoundingClientRect().right;
        }
        else if (scrollDirection === 'right') {
            offset = Math.max(1, event.clientX - rootRef.current.getBoundingClientRect().left);
        }
        else {
            throw new Error('MUI X: Wrong drag direction');
        }
        offset = (offset - CLIFF) * SLOP + CLIFF;
        // Avoid freeze and inertia.
        timeout.start(0, function () {
            apiRef.current.scroll({
                left: scrollPosition.current.left + offset,
                top: scrollPosition.current.top,
            });
        });
    });
    return (<GridScrollAreaContent {...props} ref={rootRef} getCanScrollMore={getCanScrollMore} style={style} handleDragOver={handleDragOver}/>);
}
function GridVerticalScrollAreaContent(props) {
    var scrollDirection = props.scrollDirection, scrollPosition = props.scrollPosition;
    var rootRef = React.useRef(null);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var timeout = (0, useTimeout_1.useTimeout)();
    var rowsMeta = (0, useGridSelector_1.useGridSelector)(apiRef, gridRowsMetaSelector_1.gridRowsMetaSelector);
    var getCanScrollMore = function () {
        var dimensions = (0, gridDimensionsSelectors_1.gridDimensionsSelector)(apiRef);
        if (scrollDirection === 'up') {
            // Only render if the user has not reached yet the top of the list
            return scrollPosition.current.top > 0;
        }
        if (scrollDirection === 'down') {
            // Only render if the user has not reached yet the bottom of the list
            var totalRowsHeight = rowsMeta.currentPageTotalHeight || 0;
            var maxScrollTop = totalRowsHeight -
                dimensions.viewportInnerSize.height -
                (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);
            return scrollPosition.current.top < maxScrollTop;
        }
        return false;
    };
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var totalHeaderHeight = (0, gridColumnsUtils_1.getTotalHeaderHeight)(apiRef, rootProps);
    var style = {
        top: scrollDirection === 'up' ? totalHeaderHeight : undefined,
        bottom: scrollDirection === 'down' ? 0 : undefined,
    };
    var handleDragOver = (0, useEventCallback_1.default)(function (event) {
        var offset;
        // Prevents showing the forbidden cursor
        event.preventDefault();
        if (scrollDirection === 'up') {
            offset = event.clientY - rootRef.current.getBoundingClientRect().bottom;
        }
        else if (scrollDirection === 'down') {
            offset = Math.max(1, event.clientY - rootRef.current.getBoundingClientRect().top);
        }
        else {
            throw new Error('MUI X: Wrong drag direction');
        }
        offset = (offset - CLIFF) * SLOP + CLIFF;
        // Avoid freeze and inertia.
        timeout.start(0, function () {
            apiRef.current.scroll({
                left: scrollPosition.current.left,
                top: scrollPosition.current.top + offset,
            });
        });
    });
    return (<GridScrollAreaContent {...props} ref={rootRef} getCanScrollMore={getCanScrollMore} style={style} handleDragOver={handleDragOver}/>);
}
var GridScrollAreaContent = (0, forwardRef_1.forwardRef)(function GridScrollAreaContent(props, ref) {
    var scrollDirection = props.scrollDirection, getCanScrollMore = props.getCanScrollMore, style = props.style, handleDragOver = props.handleDragOver;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var _a = React.useState(getCanScrollMore), canScrollMore = _a[0], setCanScrollMore = _a[1];
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = __assign(__assign({}, rootProps), { scrollDirection: scrollDirection });
    var classes = useUtilityClasses(ownerState);
    var handleScrolling = function () {
        setCanScrollMore(getCanScrollMore);
    };
    (0, useGridEvent_1.useGridEvent)(apiRef, 'scrollPositionChange', handleScrolling);
    if (!canScrollMore) {
        return null;
    }
    return (<GridScrollAreaRawRoot ref={ref} className={classes.root} ownerState={ownerState} onDragOver={handleDragOver} style={style}/>);
});
exports.GridScrollArea = (0, fastMemo_1.fastMemo)(GridScrollAreaWrapper);
