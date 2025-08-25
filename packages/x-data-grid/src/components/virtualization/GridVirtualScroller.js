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
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var hasScrollY = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollYSelector);
    var hasScrollX = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasScrollXSelector);
    var hasPinnedRight = (0, useGridSelector_1.useGridSelector)(apiRef, hasPinnedRightSelector);
    var hasBottomFiller = (0, useGridSelector_1.useGridSelector)(apiRef, gridDimensionsSelectors_1.gridHasBottomFillerSelector);
    var _a = (0, useGridOverlays_1.useGridOverlays)(), getOverlay = _a.getOverlay, overlaysProps = _a.overlaysProps;
    var ownerState = __assign({ classes: rootProps.classes, hasScrollX: hasScrollX, hasPinnedRight: hasPinnedRight }, overlaysProps);
    var classes = useUtilityClasses(ownerState);
    var virtualScroller = apiRef.current.virtualizer.api.useVirtualization().getters;
    var getContainerProps = virtualScroller.getContainerProps, getScrollerProps = virtualScroller.getScrollerProps, getContentProps = virtualScroller.getContentProps, getScrollbarVerticalProps = virtualScroller.getScrollbarVerticalProps, getScrollbarHorizontalProps = virtualScroller.getScrollbarHorizontalProps, getRows = virtualScroller.getRows, getScrollAreaProps = virtualScroller.getScrollAreaProps;
    var rows = getRows(undefined, (0, rows_1.gridRowTreeSelector)(apiRef));
    return (<GridMainContainer_1.GridMainContainer className={classes.root} {...getContainerProps()} ownerState={ownerState}>
      <GridScrollArea_1.GridScrollArea scrollDirection="left" {...getScrollAreaProps()}/>
      <GridScrollArea_1.GridScrollArea scrollDirection="right" {...getScrollAreaProps()}/>
      <GridScrollArea_1.GridScrollArea scrollDirection="up" {...getScrollAreaProps()}/>
      <GridScrollArea_1.GridScrollArea scrollDirection="down" {...getScrollAreaProps()}/>
      <Scroller className={classes.scroller} {...getScrollerProps()} ownerState={ownerState}>
        <GridTopContainer_1.GridTopContainer>
          {!rootProps.listView && <GridHeaders_1.GridHeaders />}
          <rootProps.slots.pinnedRows position="top" virtualScroller={virtualScroller}/>
        </GridTopContainer_1.GridTopContainer>

        {getOverlay()}

        <GridVirtualScrollerContent_1.GridVirtualScrollerContent {...getContentProps()}>
          <GridVirtualScrollerRenderZone_1.GridVirtualScrollerRenderZone role="rowgroup">
            {rows}
            {<rootProps.slots.detailPanels virtualScroller={virtualScroller}/>}
          </GridVirtualScrollerRenderZone_1.GridVirtualScrollerRenderZone>
        </GridVirtualScrollerContent_1.GridVirtualScrollerContent>

        {hasBottomFiller && <GridVirtualScrollerFiller_1.GridVirtualScrollerFiller rowsLength={rows.length}/>}
        <rootProps.slots.bottomContainer>
          <rootProps.slots.pinnedRows position="bottom" virtualScroller={virtualScroller}/>
        </rootProps.slots.bottomContainer>
      </Scroller>
      {hasScrollX && !rootProps.listView && (<GridVirtualScrollbar_1.GridVirtualScrollbar position="horizontal" {...getScrollbarHorizontalProps()}/>)}
      {hasScrollY && <GridVirtualScrollbar_1.GridVirtualScrollbar position="vertical" {...getScrollbarVerticalProps()}/>}
      {props.children}
    </GridMainContainer_1.GridMainContainer>);
}
