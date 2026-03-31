'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import * as platform from '@mui/x-internals/platform';
import { createSelectorMemoized } from '@mui/x-internals/store';
import { Dimensions } from '../../features/dimensions';
import { Virtualization } from './virtualization';
import useRefCallback from '../../utils/useRefCallback';
export class Layout {
    static elements = ['scroller', 'container'];
    refs;
    constructor(refs) {
        this.refs = refs;
    }
    refSetter(name) {
        return (node) => {
            if (node && this.refs[name].current !== node) {
                this.refs[name].current = node;
            }
        };
    }
}
export class LayoutDataGrid extends Layout {
    static elements = [
        'scroller',
        'container',
        'content',
        'positioner',
        'scrollbarVertical',
        'scrollbarHorizontal',
    ];
    use(store, _params, _api, layoutParams) {
        const { scrollerRef, containerRef } = layoutParams;
        const scrollbarVerticalRef = useScrollbarRefCallback(this.refs.scroller, this.refSetter('scrollbarVertical'), 'scrollTop');
        const scrollbarHorizontalRef = useScrollbarRefCallback(this.refs.scroller, this.refSetter('scrollbarHorizontal'), 'scrollLeft');
        store.state.virtualization.context = {
            scrollerRef,
            containerRef,
            scrollbarVerticalRef,
            scrollbarHorizontalRef,
        };
    }
    static selectors = {
        containerProps: createSelectorMemoized(Virtualization.selectors.context, (context) => ({
            ref: context.containerRef,
        })),
        scrollerProps: createSelectorMemoized(Virtualization.selectors.context, Dimensions.selectors.autoHeight, Dimensions.selectors.needsHorizontalScrollbar, (context, autoHeight, needsHorizontalScrollbar) => ({
            ref: context.scrollerRef,
            style: {
                // TODO: fall back to overflow: 'auto' if no overflowX or overflowY is set?
                overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
                overflowY: autoHeight ? 'hidden' : undefined,
                // TODO: should include display: 'flex', flexDirection: 'column' since the Content has flexBasis and flexShrink?
            },
            role: 'presentation',
            // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
            // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
            tabIndex: platform.isFirefox ? -1 : undefined,
        })),
        contentProps: createSelectorMemoized(Dimensions.selectors.contentHeight, Dimensions.selectors.minimalContentHeight, Dimensions.selectors.columnsTotalWidth, Dimensions.selectors.needsHorizontalScrollbar, (contentHeight, minimalContentHeight, columnsTotalWidth, needsHorizontalScrollbar) => ({
            style: {
                width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
                flexBasis: contentHeight === 0 ? minimalContentHeight : contentHeight,
                flexShrink: 0,
            },
            role: 'presentation',
        })),
        positionerProps: createSelectorMemoized(Virtualization.selectors.offsetTop, (offsetTop) => ({
            style: {
                transform: `translate3d(0, ${offsetTop}px, 0)`,
            },
        })),
        scrollbarHorizontalProps: createSelectorMemoized(Virtualization.selectors.context, Virtualization.selectors.scrollPosition, (context, scrollPosition) => ({
            ref: context.scrollbarHorizontalRef,
            scrollPosition,
        })),
        scrollbarVerticalProps: createSelectorMemoized(Virtualization.selectors.context, Virtualization.selectors.scrollPosition, (context, scrollPosition) => ({
            ref: context.scrollbarVerticalRef,
            scrollPosition,
        })),
        scrollAreaProps: createSelectorMemoized(Virtualization.selectors.scrollPosition, (scrollPosition) => ({
            scrollPosition,
        })),
    };
}
// The current virtualizer API is exposed on one of the DataGrid slots, so we need to keep
// the old API for backward compatibility. This API prevents using fine-grained reactivity
// as all props are returned in a single object, so everything re-renders on any change.
//
// TODO(v9): Remove the legacy API.
export class LayoutDataGridLegacy extends LayoutDataGrid {
    use(store, _params, _api, layoutParams) {
        super.use(store, _params, _api, layoutParams);
        const containerProps = store.use(LayoutDataGrid.selectors.containerProps);
        const scrollerProps = store.use(LayoutDataGrid.selectors.scrollerProps);
        const contentProps = store.use(LayoutDataGrid.selectors.contentProps);
        const positionerProps = store.use(LayoutDataGrid.selectors.positionerProps);
        const scrollbarVerticalProps = store.use(LayoutDataGrid.selectors.scrollbarVerticalProps);
        const scrollbarHorizontalProps = store.use(LayoutDataGrid.selectors.scrollbarHorizontalProps);
        const scrollAreaProps = store.use(LayoutDataGrid.selectors.scrollAreaProps);
        return {
            getContainerProps: () => containerProps,
            getScrollerProps: () => scrollerProps,
            getContentProps: () => contentProps,
            getPositionerProps: () => positionerProps,
            getScrollbarVerticalProps: () => scrollbarVerticalProps,
            getScrollbarHorizontalProps: () => scrollbarHorizontalProps,
            getScrollAreaProps: () => scrollAreaProps,
        };
    }
}
export class LayoutList extends Layout {
    static elements = ['scroller', 'container', 'content', 'positioner'];
    use(store, _params, _api, layoutParams) {
        const { scrollerRef, containerRef } = layoutParams;
        const mergedRef = useForkRef(scrollerRef, containerRef);
        store.state.virtualization.context = {
            mergedRef,
        };
    }
    static selectors = {
        containerProps: createSelectorMemoized(Virtualization.selectors.context, Dimensions.selectors.autoHeight, Dimensions.selectors.needsHorizontalScrollbar, (context, autoHeight, needsHorizontalScrollbar) => ({
            ref: context.mergedRef,
            style: {
                overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
                overflowY: autoHeight ? 'hidden' : undefined,
                position: 'relative',
            },
            role: 'presentation',
            // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
            // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
            tabIndex: platform.isFirefox ? -1 : undefined,
        })),
        contentProps: createSelectorMemoized(Dimensions.selectors.contentHeight, (contentHeight) => {
            return {
                style: {
                    position: 'absolute',
                    display: 'inline-block',
                    width: '100%',
                    height: contentHeight,
                    top: 0,
                    left: 0,
                    zIndex: -1,
                },
                role: 'presentation',
            };
        }),
        positionerProps: createSelectorMemoized(Virtualization.selectors.offsetTop, (offsetTop) => ({
            style: {
                height: offsetTop,
            },
        })),
    };
}
function useScrollbarRefCallback(scrollerRef, refSetter, scrollProperty) {
    const isLocked = React.useRef(false);
    const lastPosition = React.useRef(0);
    const handleScrollerScroll = useEventCallback((scrollbar) => {
        const scroller = scrollerRef.current;
        if (!scroller) {
            return;
        }
        const scrollerPosition = scroller[scrollProperty];
        if (scrollerPosition === lastPosition.current) {
            return;
        }
        lastPosition.current = scrollerPosition;
        if (isLocked.current) {
            isLocked.current = false;
            return;
        }
        isLocked.current = true;
        scrollbar[scrollProperty] = scrollerPosition;
    });
    const handleScrollbarScroll = useEventCallback((scrollbar) => {
        const scroller = scrollerRef.current;
        if (!scroller) {
            return;
        }
        if (isLocked.current) {
            isLocked.current = false;
            return;
        }
        isLocked.current = true;
        scroller[scrollProperty] = scrollbar[scrollProperty];
    });
    return useRefCallback((scrollbar) => {
        refSetter(scrollbar);
        const scroller = scrollerRef.current;
        if (!scroller) {
            return undefined;
        }
        const onScrollerScroll = () => handleScrollerScroll(scrollbar);
        const onScrollbarScroll = () => handleScrollbarScroll(scrollbar);
        const options = { passive: true };
        scroller.addEventListener('scroll', onScrollerScroll, options);
        scrollbar.addEventListener('scroll', onScrollbarScroll, options);
        return () => {
            scroller.removeEventListener('scroll', onScrollerScroll);
            scrollbar.removeEventListener('scroll', onScrollbarScroll);
        };
    });
}
