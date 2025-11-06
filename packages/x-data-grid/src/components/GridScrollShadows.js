"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridScrollShadows = GridScrollShadows;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var composeClasses_1 = require("@mui/utils/composeClasses");
var hooks_1 = require("../hooks");
var gridRowsSelector_1 = require("../hooks/features/rows/gridRowsSelector");
var useGridRootProps_1 = require("../hooks/utils/useGridRootProps");
var cssVariables_1 = require("../constants/cssVariables");
var useGridPrivateApiContext_1 = require("../hooks/utils/useGridPrivateApiContext");
var gridDimensionsSelectors_1 = require("../hooks/features/dimensions/gridDimensionsSelectors");
var constants_1 = require("../constants");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, position = ownerState.position;
    var slots = {
        root: ['scrollShadow', "scrollShadow--".concat(position)],
    };
    return (0, composeClasses_1.default)(slots, constants_1.getDataGridUtilityClass, classes);
};
var ScrollShadow = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ScrollShadow',
    overridesResolver: function (props, styles) { return [styles.root, styles[props.position]]; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transition: cssVariables_1.vars.transition(['box-shadow'], { duration: cssVariables_1.vars.transitions.duration.short }),
        '--length': theme.palette.mode === 'dark' ? '8px' : '6px',
        '--length-inverse': 'calc(var(--length) * -1)',
        '--opacity': theme.palette.mode === 'dark' ? '0.7' : '0.18',
        '--blur': 'var(--length)',
        '--spread': 'calc(var(--length) * -1)',
        '--color': '0, 0, 0',
        '--color-start': 'rgba(var(--color), calc(var(--hasScrollStart) * var(--opacity)))',
        '--color-end': 'rgba(var(--color), calc(var(--hasScrollEnd) * var(--opacity)))',
        variants: [
            {
                props: { position: 'vertical' },
                style: {
                    top: 'var(--DataGrid-topContainerHeight)',
                    bottom: 'calc(var(--DataGrid-bottomContainerHeight) + var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize))',
                    boxShadow: 'inset 0 var(--length) var(--blur) var(--spread) var(--color-start), inset 0 var(--length-inverse) var(--blur) var(--spread) var(--color-end)',
                },
            },
            {
                props: { position: 'horizontal' },
                style: {
                    left: 'var(--DataGrid-leftPinnedWidth)',
                    right: 'calc(var(--DataGrid-rightPinnedWidth) + var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
                    boxShadow: 'inset var(--length) 0 var(--blur) var(--spread) var(--color-start), inset var(--length-inverse) 0 var(--blur) var(--spread) var(--color-end)',
                },
            },
        ],
    });
});
function GridScrollShadows(props) {
    var _a, _b, _c;
    var position = props.position;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var ownerState = { classes: rootProps.classes, position: position };
    var classes = useUtilityClasses(ownerState);
    var ref = React.useRef(null);
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var hasScrollX = (0, hooks_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollXSelector);
    var hasScrollY = (0, hooks_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollYSelector);
    var pinnedRows = (0, hooks_1.useGridSelector)(apiRef, gridRowsSelector_1.gridPinnedRowsSelector);
    var pinnedColumns = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridPinnedColumnsSelector);
    var initialScrollable = position === 'vertical'
        ? hasScrollY && ((_a = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom) === null || _a === void 0 ? void 0 : _a.length) > 0
        : hasScrollX &&
            ((_b = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.right) === null || _b === void 0 ? void 0 : _b.length) !== undefined &&
            ((_c = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.right) === null || _c === void 0 ? void 0 : _c.length) > 0;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var updateScrollShadowVisibility = React.useCallback(function (scrollPosition) {
        var _a, _b, _c, _d, _e, _f;
        if (!ref.current) {
            return;
        }
        // Math.abs to convert negative scroll position (RTL) to positive
        var scroll = Math.abs(Math.round(scrollPosition));
        var dimensions = (0, hooks_1.gridDimensionsSelector)(apiRef);
        var maxScroll = Math.round(dimensions.contentSize[position === 'vertical' ? 'height' : 'width'] -
            dimensions.viewportInnerSize[position === 'vertical' ? 'height' : 'width']);
        var hasPinnedStart = position === 'vertical'
            ? ((_a = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.top) === null || _a === void 0 ? void 0 : _a.length) > 0
            : ((_b = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.left) === null || _b === void 0 ? void 0 : _b.length) !== undefined && ((_c = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.left) === null || _c === void 0 ? void 0 : _c.length) > 0;
        var hasPinnedEnd = position === 'vertical'
            ? ((_d = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom) === null || _d === void 0 ? void 0 : _d.length) > 0
            : ((_e = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.right) === null || _e === void 0 ? void 0 : _e.length) !== undefined && ((_f = pinnedColumns === null || pinnedColumns === void 0 ? void 0 : pinnedColumns.right) === null || _f === void 0 ? void 0 : _f.length) > 0;
        var scrollIsNotAtStart = isRtl ? scroll < maxScroll : scroll > 0;
        var scrollIsNotAtEnd = isRtl ? scroll > 0 : scroll < maxScroll;
        ref.current.style.setProperty('--hasScrollStart', hasPinnedStart && scrollIsNotAtStart ? '1' : '0');
        ref.current.style.setProperty('--hasScrollEnd', hasPinnedEnd && scrollIsNotAtEnd ? '1' : '0');
    }, [pinnedRows, pinnedColumns, isRtl, position, apiRef]);
    var handleScrolling = function (scrollParams) {
        updateScrollShadowVisibility(scrollParams[position === 'vertical' ? 'top' : 'left']);
    };
    var handleColumnResizeStop = function () {
        var _a, _b;
        if (position === 'horizontal') {
            updateScrollShadowVisibility(((_b = (_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollLeft) || 0);
        }
    };
    (0, hooks_1.useGridEvent)(apiRef, 'scrollPositionChange', handleScrolling);
    (0, hooks_1.useGridEvent)(apiRef, 'columnResizeStop', handleColumnResizeStop);
    React.useEffect(function () {
        var _a, _b, _c, _d, _e;
        updateScrollShadowVisibility((_e = (position === 'horizontal'
            ? (_b = (_a = apiRef.current.virtualScrollerRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.scrollLeft
            : (_d = (_c = apiRef.current.virtualScrollerRef) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.scrollTop)) !== null && _e !== void 0 ? _e : 0);
    }, [updateScrollShadowVisibility, apiRef, position]);
    return ((0, jsx_runtime_1.jsx)(ScrollShadow, { className: classes.root, ownerState: ownerState, ref: ref, style: {
            '--hasScrollStart': 0,
            '--hasScrollEnd': initialScrollable ? '1' : '0',
        } }));
}
