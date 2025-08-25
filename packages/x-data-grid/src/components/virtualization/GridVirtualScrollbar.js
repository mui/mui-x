"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridVirtualScrollbar = void 0;
var React = require("react");
var system_1 = require("@mui/system");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useForkRef_1 = require("@mui/utils/useForkRef");
var composeClasses_1 = require("@mui/utils/composeClasses");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useOnMount_1 = require("../../hooks/utils/useOnMount");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var hooks_1 = require("../../hooks");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function (ownerState, position) {
    var classes = ownerState.classes;
    var slots = {
        root: ['scrollbar', "scrollbar--".concat(position)],
        content: ['scrollbarContent'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
};
var Scrollbar = (0, system_1.styled)('div')({
    position: 'absolute',
    display: 'inline-block',
    zIndex: 60,
    '&:hover': {
        zIndex: 70,
    },
    // In macOS Safari and Gnome Web, scrollbars are overlaid and don't affect the layout. So we consider
    // their size to be 0px throughout all the calculations, but the floating scrollbar container does need
    // to appear and have a real size. We set it to 14px because it seems like an acceptable value and we
    // don't have a method to find the required size for scrollbars on those platforms.
    '--size': 'calc(max(var(--DataGrid-scrollbarSize), 14px))',
});
var ScrollbarVertical = (0, system_1.styled)(Scrollbar)({
    width: 'var(--size)',
    height: 'calc(var(--DataGrid-hasScrollY) * (100% - var(--DataGrid-topContainerHeight) - var(--DataGrid-bottomContainerHeight) - var(--DataGrid-hasScrollX) * var(--DataGrid-scrollbarSize)))',
    overflowY: 'auto',
    overflowX: 'hidden',
    // Disable focus-visible style, it's a scrollbar.
    outline: 0,
    '& > div': {
        width: 'var(--size)',
    },
    top: 'var(--DataGrid-topContainerHeight)',
    right: '0px',
});
var ScrollbarHorizontal = (0, system_1.styled)(Scrollbar)({
    width: '100%',
    height: 'var(--size)',
    overflowY: 'hidden',
    overflowX: 'auto',
    // Disable focus-visible style, it's a scrollbar.
    outline: 0,
    '& > div': {
        height: 'var(--size)',
    },
    bottom: '0px',
});
var GridVirtualScrollbar = (0, forwardRef_1.forwardRef)(function GridVirtualScrollbar(props, ref) {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var isLocked = React.useRef(false);
    var lastPosition = React.useRef(0);
    var scrollbarRef = React.useRef(null);
    var contentRef = React.useRef(null);
    var classes = useUtilityClasses(rootProps, props.position);
    var dimensions = (0, hooks_1.useGridSelector)(apiRef, hooks_1.gridDimensionsSelector);
    var propertyDimension = props.position === 'vertical' ? 'height' : 'width';
    var propertyScroll = props.position === 'vertical' ? 'scrollTop' : 'scrollLeft';
    var propertyScrollPosition = props.position === 'vertical' ? 'top' : 'left';
    var hasScroll = props.position === 'vertical' ? dimensions.hasScrollX : dimensions.hasScrollY;
    var contentSize = dimensions.minimumSize[propertyDimension] + (hasScroll ? dimensions.scrollbarSize : 0);
    var scrollbarSize = props.position === 'vertical'
        ? dimensions.viewportInnerSize.height
        : dimensions.viewportOuterSize.width;
    var scrollbarInnerSize = scrollbarSize * (contentSize / dimensions.viewportOuterSize[propertyDimension]);
    var onScrollerScroll = (0, useEventCallback_1.default)(function () {
        var scrollbar = scrollbarRef.current;
        var scrollPosition = props.scrollPosition.current;
        if (!scrollbar) {
            return;
        }
        if (scrollPosition[propertyScrollPosition] === lastPosition.current) {
            return;
        }
        lastPosition.current = scrollPosition[propertyScrollPosition];
        if (isLocked.current) {
            isLocked.current = false;
            return;
        }
        isLocked.current = true;
        var value = scrollPosition[propertyScrollPosition] / contentSize;
        scrollbar[propertyScroll] = value * scrollbarInnerSize;
    });
    var onScrollbarScroll = (0, useEventCallback_1.default)(function () {
        var scroller = apiRef.current.virtualScrollerRef.current;
        var scrollbar = scrollbarRef.current;
        if (!scrollbar) {
            return;
        }
        if (isLocked.current) {
            isLocked.current = false;
            return;
        }
        isLocked.current = true;
        var value = scrollbar[propertyScroll] / scrollbarInnerSize;
        scroller[propertyScroll] = value * contentSize;
    });
    (0, useOnMount_1.useOnMount)(function () {
        var scroller = apiRef.current.virtualScrollerRef.current;
        var scrollbar = scrollbarRef.current;
        var options = { passive: true };
        scroller.addEventListener('scroll', onScrollerScroll, options);
        scrollbar.addEventListener('scroll', onScrollbarScroll, options);
        return function () {
            scroller.removeEventListener('scroll', onScrollerScroll, options);
            scrollbar.removeEventListener('scroll', onScrollbarScroll, options);
        };
    });
    React.useEffect(function () {
        var content = contentRef.current;
        content.style.setProperty(propertyDimension, "".concat(scrollbarInnerSize, "px"));
    }, [scrollbarInnerSize, propertyDimension]);
    var Container = props.position === 'vertical' ? ScrollbarVertical : ScrollbarHorizontal;
    return (<Container ref={(0, useForkRef_1.default)(ref, scrollbarRef)} className={classes.root} style={props.position === 'vertical' && rootProps.listView
            ? { height: '100%', top: 0 }
            : undefined} tabIndex={-1} aria-hidden="true" 
    // tabIndex does not prevent focus with a mouse click, throwing a console error
    // https://github.com/mui/mui-x/issues/16706
    onFocus={function (event) {
            event.target.blur();
        }}>
        <div ref={contentRef} className={classes.content}/>
      </Container>);
});
exports.GridVirtualScrollbar = GridVirtualScrollbar;
