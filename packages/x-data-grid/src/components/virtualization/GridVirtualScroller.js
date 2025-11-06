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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridVirtualScroller = GridVirtualScroller;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var gridDimensionsSelectors_1 = require("../../hooks/features/dimensions/gridDimensionsSelectors");
var rows_1 = require("../../hooks/features/rows");
var GridScrollArea_1 = require("../GridScrollArea");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var gridClasses_1 = require("../../constants/gridClasses");
var useGridOverlays_1 = require("../../hooks/features/overlays/useGridOverlays");
var GridHeaders_1 = require("../GridHeaders");
var GridMainContainer_1 = require("./GridMainContainer");
var GridTopContainer_1 = require("./GridTopContainer");
var GridVirtualScrollerContent_1 = require("./GridVirtualScrollerContent");
var GridVirtualScrollerFiller_1 = require("./GridVirtualScrollerFiller");
var GridVirtualScrollerRenderZone_1 = require("./GridVirtualScrollerRenderZone");
var GridVirtualScrollbar_1 = require("./GridVirtualScrollbar");
var GridScrollShadows_1 = require("../GridScrollShadows");
var GridOverlays_1 = require("../base/GridOverlays");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes, hasScrollX = ownerState.hasScrollX, hasPinnedRight = ownerState.hasPinnedRight, loadingOverlayVariant = ownerState.loadingOverlayVariant, overlayType = ownerState.overlayType;
    var hideContent = loadingOverlayVariant === 'skeleton' || overlayType === 'noColumnsOverlay';
    var slots = {
        root: ['main', hasPinnedRight && 'main--hasPinnedRight', hideContent && 'main--hiddenContent'],
        scroller: ['virtualScroller', hasScrollX && 'virtualScroller--hasScrollX'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var Scroller = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'VirtualScroller',
    overridesResolver: function (props, styles) {
        var ownerState = props.ownerState;
        return [styles.virtualScroller, ownerState.hasScrollX && styles['virtualScroller--hasScrollX']];
    },
})({
    position: 'relative',
    height: '100%',
    flexGrow: 1,
    overflow: 'scroll',
    scrollbarWidth: 'none' /* Firefox */,
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {
        display: 'none' /* Safari and Chrome */,
    },
    '@media print': {
        overflow: 'hidden',
    },
    // See https://github.com/mui/mui-x/issues/10547
    zIndex: 0,
});
var hasPinnedRightSelector = function (apiRef) {
    return apiRef.current.state.dimensions.rightPinnedWidth > 0;
};
function GridVirtualScroller(props) {
    var _a, _b, _c, _d;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var hasScrollY = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollYSelector);
    var hasScrollX = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollXSelector);
    var hasPinnedRight = (0, useGridSelector_1.useGridSelector)(apiRef, hasPinnedRightSelector);
    var hasBottomFiller = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasBottomFillerSelector);
    var _e = (0, useGridOverlays_1.useGridOverlays)(apiRef, rootProps), overlayType = _e.overlayType, loadingOverlayVariant = _e.loadingOverlayVariant;
    var Overlay = (_a = rootProps.slots) === null || _a === void 0 ? void 0 : _a[overlayType];
    var ownerState = {
        classes: rootProps.classes,
        hasScrollX: hasScrollX,
        hasPinnedRight: hasPinnedRight,
        overlayType: overlayType,
        loadingOverlayVariant: loadingOverlayVariant,
    };
    var classes = useUtilityClasses(ownerState);
    var virtualScroller = apiRef.current.virtualizer.api.useVirtualization().getters;
    var getContainerProps = virtualScroller.getContainerProps, getScrollerProps = virtualScroller.getScrollerProps, getContentProps = virtualScroller.getContentProps, getScrollbarVerticalProps = virtualScroller.getScrollbarVerticalProps, getScrollbarHorizontalProps = virtualScroller.getScrollbarHorizontalProps, getRows = virtualScroller.getRows, getScrollAreaProps = virtualScroller.getScrollAreaProps;
    var rows = getRows(undefined, (0, rows_1.gridRowTreeSelector)(apiRef));
    return ((0, jsx_runtime_1.jsxs)(GridMainContainer_1.GridMainContainer, __assign({ className: classes.root }, getContainerProps(), { ownerState: ownerState, children: [(0, jsx_runtime_1.jsx)(GridScrollArea_1.GridScrollArea, __assign({ scrollDirection: "left" }, getScrollAreaProps())), (0, jsx_runtime_1.jsx)(GridScrollArea_1.GridScrollArea, __assign({ scrollDirection: "right" }, getScrollAreaProps())), (0, jsx_runtime_1.jsx)(GridScrollArea_1.GridScrollArea, __assign({ scrollDirection: "up" }, getScrollAreaProps())), (0, jsx_runtime_1.jsx)(GridScrollArea_1.GridScrollArea, __assign({ scrollDirection: "down" }, getScrollAreaProps())), (0, jsx_runtime_1.jsxs)(Scroller, __assign({ className: classes.scroller }, getScrollerProps(), { ownerState: ownerState, children: [(0, jsx_runtime_1.jsxs)(GridTopContainer_1.GridTopContainer, { children: [!rootProps.listView && (0, jsx_runtime_1.jsx)(GridHeaders_1.GridHeaders, {}), (0, jsx_runtime_1.jsx)(rootProps.slots.pinnedRows, { position: "top", virtualScroller: virtualScroller })] }), overlayType && ((0, jsx_runtime_1.jsx)(GridOverlays_1.GridOverlayWrapper, { overlayType: overlayType, loadingOverlayVariant: loadingOverlayVariant, children: (0, jsx_runtime_1.jsx)(Overlay, __assign({}, (_b = rootProps.slotProps) === null || _b === void 0 ? void 0 : _b[overlayType])) })), (0, jsx_runtime_1.jsx)(GridVirtualScrollerContent_1.GridVirtualScrollerContent, __assign({}, getContentProps(), { children: (0, jsx_runtime_1.jsxs)(GridVirtualScrollerRenderZone_1.GridVirtualScrollerRenderZone, { role: "rowgroup", children: [rows, (0, jsx_runtime_1.jsx)(rootProps.slots.detailPanels, { virtualScroller: virtualScroller })] }) })), hasBottomFiller && (0, jsx_runtime_1.jsx)(GridVirtualScrollerFiller_1.GridVirtualScrollerFiller, { rowsLength: rows.length }), (0, jsx_runtime_1.jsx)(rootProps.slots.bottomContainer, { children: (0, jsx_runtime_1.jsx)(rootProps.slots.pinnedRows, { position: "bottom", virtualScroller: virtualScroller }) })] })), hasScrollX && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [((_c = rootProps.pinnedColumnsSectionSeparator) === null || _c === void 0 ? void 0 : _c.endsWith('shadow')) && ((0, jsx_runtime_1.jsx)(GridScrollShadows_1.GridScrollShadows, { position: "horizontal" })), (0, jsx_runtime_1.jsx)(GridVirtualScrollbar_1.GridVirtualScrollbar, __assign({ position: "horizontal" }, getScrollbarHorizontalProps()))] })), hasScrollY && ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [((_d = rootProps.pinnedRowsSectionSeparator) === null || _d === void 0 ? void 0 : _d.endsWith('shadow')) && ((0, jsx_runtime_1.jsx)(GridScrollShadows_1.GridScrollShadows, { position: "vertical" })), (0, jsx_runtime_1.jsx)(GridVirtualScrollbar_1.GridVirtualScrollbar, __assign({ position: "vertical" }, getScrollbarVerticalProps()))] })), hasScrollX && hasScrollY && (0, jsx_runtime_1.jsx)(GridVirtualScrollbar_1.ScrollbarCorner, { "aria-hidden": "true" }), props.children] })));
}
