'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { platform } from '@base-ui/utils/platform';
import { Store, createSelectorMemoized } from '@mui/x-internals/store';
import { Dimensions } from '../../features/dimensions';
import { Virtualization, type VirtualizationLayoutParams } from './virtualization';
import type { BaseState, ParamsWithDefaults } from '../../useVirtualizer';
import useRefCallback from '../../utils/useRefCallback';

/* eslint-disable react-hooks/rules-of-hooks */

type RequiredAPI = Dimensions.API;

type BaseElements = {
  scroller: React.RefObject<HTMLElement | null>;
  container: React.RefObject<HTMLElement | null>;
};
type AnyElements = BaseElements & Record<string, React.RefObject<HTMLElement | null>>;

export abstract class Layout<E extends AnyElements = AnyElements> {
  static elements: readonly (keyof AnyElements)[] = ['scroller', 'container'];

  refs: E;

  constructor(refs: E) {
    this.refs = refs;
  }

  abstract use(
    store: Store<BaseState>,
    params: ParamsWithDefaults,
    api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ): any;

  refSetter(name: keyof E) {
    return (node: HTMLDivElement | null) => {
      if (this.refs[name].current !== node) {
        this.refs[name].current = node;
      }
    };
  }
}

type DataGridElements = BaseElements & {
  scrollbarVertical: React.RefObject<HTMLElement | null>;
  scrollbarHorizontal: React.RefObject<HTMLElement | null>;
};

export class LayoutDataGrid extends Layout<DataGridElements> {
  static elements = [
    'scroller',
    'container',
    'content',
    'positioner',
    'scrollbarVertical',
    'scrollbarHorizontal',
  ] as const;

  use(
    store: Store<BaseState>,
    _params: ParamsWithDefaults,
    api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ) {
    const { scrollerRef, containerRef } = layoutParams;

    const scrollbarVerticalRef = useScrollbarRefCallback(
      this.refs.scroller,
      this.refSetter('scrollbarVertical'),
      'scrollTop',
      api.updateDimensions,
    );
    const scrollbarHorizontalRef = useScrollbarRefCallback(
      this.refs.scroller,
      this.refSetter('scrollbarHorizontal'),
      'scrollLeft',
      api.updateDimensions,
    );

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

    scrollerProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.autoHeight,
      Dimensions.selectors.needsHorizontalScrollbar,
      (context, autoHeight, needsHorizontalScrollbar) => ({
        ref: context.scrollerRef,
        style: {
          // TODO: fall back to overflow: 'auto' if no overflowX or overflowY is set?
          overflowX: !needsHorizontalScrollbar ? ('hidden' as const) : undefined,
          overflowY: autoHeight ? ('hidden' as const) : undefined,
          // TODO: should include display: 'flex', flexDirection: 'column' since the Content has flexBasis and flexShrink?
        },
        role: 'presentation',
        // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
        // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
        tabIndex: platform.engine.gecko ? -1 : undefined,
      }),
    ),

    scrollerContentProps: createSelectorMemoized(
      Virtualization.selectors.layoutMode,
      Dimensions.selectors.dimensions,
      Dimensions.selectors.needsVerticalScrollbar,
      Dimensions.selectors.needsHorizontalScrollbar,
      (layoutMode, dimensions, needsVerticalScrollbar, needsHorizontalScrollbar) => {
        let style: React.CSSProperties | undefined;
        if (layoutMode === 'controlled') {
          const {
            contentSize,
            scrollbarSize,
            topContainerHeight,
            bottomContainerHeight,
            minimalContentHeight,
            columnsTotalWidth,
            viewportOuterSize,
          } = dimensions;

          const verticalScrollbarSize = needsVerticalScrollbar ? scrollbarSize : 0;
          const horizontalScrollbarSize = needsHorizontalScrollbar ? scrollbarSize : 0;

          const contentHeight =
            contentSize.height === 0 ? minimalContentHeight : contentSize.height;

          const width = needsHorizontalScrollbar
            ? verticalScrollbarSize + columnsTotalWidth
            : 'auto';

          const height = cssAdd(
            cssAdd(cssAdd(contentHeight, topContainerHeight), bottomContainerHeight),
            horizontalScrollbarSize,
          );

          style = {
            width: cssMax(width, viewportOuterSize.width - verticalScrollbarSize),
            height: cssMax(height, viewportOuterSize.height - horizontalScrollbarSize),
            flex: '0 0 auto',
          } as React.CSSProperties;
        }

        return {
          style,
          role: 'presentation',
        };
      },
    ),

    viewportProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        width: dimensions.viewportOuterSize.width,
        height: dimensions.viewportOuterSize.height,
      },
      role: 'presentation',
    })),

    contentProps: createSelectorMemoized(
      Dimensions.selectors.contentHeight,
      Dimensions.selectors.minimalContentHeight,
      Dimensions.selectors.columnsTotalWidth,
      Dimensions.selectors.needsHorizontalScrollbar,
      (contentHeight, minimalContentHeight, columnsTotalWidth, needsHorizontalScrollbar) => ({
        style: {
          width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
          height: contentHeight === 0 ? minimalContentHeight : contentHeight,
          flex: '0 0 auto',
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    positionerProps: createSelectorMemoized(
      Virtualization.selectors.layoutMode,
      Virtualization.selectors.offsetTop,
      Virtualization.selectors.scrollPosition,
      (layoutMode, offsetTop, scrollPosition) => ({
        style: {
          transform:
            layoutMode === 'uncontrolled'
              ? `translate3d(0, ${offsetTop}px, 0)`
              : `translate3d(${-scrollPosition.current.left}px, ${offsetTop - scrollPosition.current.top}px, 0)`,
        },
      }),
    ),

    containerVerticalProps: createSelectorMemoized(
      Virtualization.selectors.layoutMode,
      Virtualization.selectors.scrollPosition,
      (layoutMode, scrollPosition) =>
        layoutMode === 'uncontrolled'
          ? undefined
          : {
              style: {
                transform: `translate3d(${-scrollPosition.current.left}px, 0, 0)`,
              },
            },
    ),

    scrollbarHorizontalProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Virtualization.selectors.scrollPosition,
      (context, scrollPosition) => ({
        ref: context.scrollbarHorizontalRef,
        scrollPosition,
      }),
    ),

    scrollbarVerticalProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Virtualization.selectors.scrollPosition,
      (context, scrollPosition) => ({
        ref: context.scrollbarVerticalRef,
        scrollPosition,
      }),
    ),

    scrollAreaProps: createSelectorMemoized(
      Virtualization.selectors.scrollPosition,
      (scrollPosition) => ({
        scrollPosition,
      }),
    ),
  };
}

type ListElements = BaseElements;

export class LayoutList extends Layout<ListElements> {
  static elements = ['scroller', 'container', 'content', 'positioner'] as const;

  use(
    store: Store<BaseState>,
    _params: ParamsWithDefaults,
    _api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ) {
    const { scrollerRef, containerRef } = layoutParams;

    const mergedRef = useForkRef(scrollerRef, containerRef);

    store.state.virtualization.context = {
      mergedRef,
    };
  }

  static selectors = {
    containerProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.autoHeight,
      Dimensions.selectors.needsHorizontalScrollbar,
      (context, autoHeight, needsHorizontalScrollbar) => ({
        ref: context.mergedRef,
        style: {
          overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
          overflowY: autoHeight ? 'hidden' : undefined,
          position: 'relative',
        } as React.CSSProperties,
        role: 'presentation',
        // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
        // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
        tabIndex: platform.engine.gecko ? -1 : undefined,
      }),
    ),

    contentProps: createSelectorMemoized(Dimensions.selectors.contentHeight, (contentHeight) => ({
      style: {
        position: 'absolute',
        display: 'inline-block',
        width: '100%',
        height: contentHeight,
        top: 0,
        left: 0,
        zIndex: -1,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    positionerProps: createSelectorMemoized(Virtualization.selectors.offsetTop, (offsetTop) => ({
      style: {
        height: offsetTop,
      } as React.CSSProperties,
    })),
  };
}

/**
 * List layout based on the "inverse sticky" technique
 * (https://pierre.computer/writing/on-rendering-diffs).
 *
 * The rendered window is placed in the normal flow at `offsetTop` (through the positioner
 * spacer) and given `position: sticky` with `top` & `bottom` set to
 * `-(renderedHeight - viewportHeight)`. Within that range the browser moves the window
 * natively with the scroll (no JS needed per frame). When the scroll position moves past
 * the rendered window before the render context updates, the window clamps to the viewport
 * edge instead of scrolling out of view, so stale content is shown instead of a blank area.
 *
 * Expected DOM structure:
 * ```tsx
 * <div {...containerProps}>         // scroller
 *   <div {...contentProps}>         // in-flow, full content height, sticky containing block
 *     <div {...positionerProps} />  // spacer, height: offsetTop
 *     <div {...windowProps}>        // sticky rendered window
 *       {rows}
 *     </div>
 *   </div>
 * </div>
 * ```
 */
export class LayoutListSticky extends Layout<ListElements> {
  static elements = ['scroller', 'container', 'content', 'positioner', 'window'] as const;

  use(
    store: Store<BaseState>,
    _params: ParamsWithDefaults,
    _api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ) {
    const { scrollerRef, containerRef } = layoutParams;

    const mergedRef = useForkRef(scrollerRef, containerRef);

    store.state.virtualization.context = {
      mergedRef,
    };
  }

  static selectors = {
    containerProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.autoHeight,
      Dimensions.selectors.needsHorizontalScrollbar,
      (context, autoHeight, needsHorizontalScrollbar) => ({
        ref: context.mergedRef,
        style: {
          overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
          overflowY: autoHeight ? 'hidden' : undefined,
          position: 'relative',
          // The positioner height changes on each render context update; native scroll
          // anchoring would fight those updates by adjusting the scroll position.
          overflowAnchor: 'none',
        } as React.CSSProperties,
        role: 'presentation',
        // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
        // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
        tabIndex: platform.engine.gecko ? -1 : undefined,
      }),
    ),

    contentProps: createSelectorMemoized(Dimensions.selectors.contentHeight, (contentHeight) => ({
      style: {
        // In-flow (not absolutely positioned): the sticky window is clamped to its
        // containing block, which must span the full content height.
        position: 'relative',
        height: contentHeight,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    positionerProps: createSelectorMemoized(Virtualization.selectors.offsetTop, (offsetTop) => ({
      style: {
        height: offsetTop,
      } as React.CSSProperties,
    })),

    windowProps: createSelectorMemoized(
      Virtualization.selectors.renderContext,
      Dimensions.selectors.rowPositions,
      Dimensions.selectors.contentHeight,
      Dimensions.selectors.dimensions,
      (renderContext, rowPositions, contentHeight, dimensions) => {
        const firstPosition = rowPositions[renderContext.firstRowIndex] ?? 0;
        // `lastRowIndex` is exclusive: when it points past the last row, the window
        // extends to the end of the content.
        const lastPosition = rowPositions[renderContext.lastRowIndex] ?? contentHeight;
        const renderedHeight = lastPosition - firstPosition;
        // Clamped to 0: if the rendered window is smaller than the viewport (few rows),
        // sticky positioning must stay inert.
        const stickyOffset = Math.min(0, -(renderedHeight - dimensions.viewportInnerSize.height));
        return {
          style: {
            position: 'sticky',
            top: stickyOffset,
            bottom: stickyOffset,
          } as React.CSSProperties,
        };
      },
    ),
  };
}

/**
 * Grid layout based on the "inverse sticky" technique. Same principle as
 * `LayoutListSticky`, extended with pinned sections. The two axes use different
 * strategies:
 * - Vertical: inverse sticky. The window's sticky offsets are asymmetric so it clamps
 *   against the inner viewport edges (below the top container, above the bottom
 *   container) rather than the scrollport edges. The top/bottom containers (headers,
 *   pinned rows) are classic sticky elements.
 * - Horizontal: controlled. The window is pinned to the scrollport (`left: 0`, sized to
 *   the viewport, `overflow: hidden`) and an inner positioner translates the rows by
 *   `-scrollLeft`. Stale columns can never leave the viewport, so horizontal render gaps
 *   are impossible; the trade-off is that horizontal movement is applied per scroll
 *   event instead of natively. As in the `controlled` layout mode, pinned column cells
 *   must use absolute positioning with JS offsets: sticky constraints ignore the
 *   positioner's transform.
 *
 * Scrolling relies on virtual scrollbars, like the DataGrid: the scroller hides its
 * native scrollbars and standalone scrollbar widgets are kept in sync with it (see
 * `useScrollbarRefCallback`). The content reserves the scrollbar lanes so the last
 * row/column can scroll out from under the overlaid widgets.
 *
 * Expected DOM structure:
 * ```tsx
 * <div {...containerProps}>                // outer wrapper (position: relative)
 *   <div {...scrollerProps}>               // scroller, native scrollbars hidden
 *     <div {...contentProps}>              // in-flow, sticky containing block
 *       <div {...topContainerProps}>       // sticky top: headers + pinned top rows
 *         <div {...positionerProps}>       // horizontal translate
 *       </div>
 *       <div {...spacerTopProps} />        // height: rowPositions[firstRowIndex]
 *       <div {...windowProps}>             // sticky rendered window
 *         <div {...positionerProps}>       // horizontal translate
 *           {rows}
 *         </div>
 *       </div>
 *       <div {...spacerBottomProps} />     // height: remaining content height
 *       <div {...bottomContainerProps}>    // sticky bottom: pinned bottom rows
 *         <div {...positionerProps}>       // horizontal translate
 *       </div>
 *     </div>
 *   </div>
 *   <div {...scrollbarVerticalProps} />    // virtual scrollbars, overlaid
 *   <div {...scrollbarHorizontalProps} />
 * </div>
 * ```
 */
export class LayoutGridSticky extends Layout<DataGridElements> {
  static elements = [
    'scroller',
    'container',
    'content',
    'topContainer',
    'spacerTop',
    'window',
    'spacerBottom',
    'bottomContainer',
    'scrollbarVertical',
    'scrollbarHorizontal',
  ] as const;

  use(
    store: Store<BaseState>,
    _params: ParamsWithDefaults,
    api: RequiredAPI,
    layoutParams: VirtualizationLayoutParams,
  ) {
    const { scrollerRef, containerRef } = layoutParams;

    const scrollbarVerticalRef = useScrollbarRefCallback(
      this.refs.scroller,
      this.refSetter('scrollbarVertical'),
      'scrollTop',
      api.updateDimensions,
    );
    const scrollbarHorizontalRef = useScrollbarRefCallback(
      this.refs.scroller,
      this.refSetter('scrollbarHorizontal'),
      'scrollLeft',
      api.updateDimensions,
    );

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
      style: {
        position: 'relative',
      } as React.CSSProperties,
      role: 'presentation',
    })),

    scrollerProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.autoHeight,
      (context, autoHeight) => ({
        ref: context.scrollerRef,
        style: {
          width: '100%',
          height: '100%',
          overflow: autoHeight ? 'hidden' : 'auto',
          position: 'relative',
          // Native scrollbars are hidden, the virtual scrollbar widgets replace them.
          scrollbarWidth: 'none',
          // The spacer heights change on each render context update; native scroll
          // anchoring would fight those updates by adjusting the scroll position.
          overflowAnchor: 'none',
        } as React.CSSProperties,
        role: 'presentation',
        // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
        // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
        tabIndex: platform.engine.gecko ? -1 : undefined,
      }),
    ),

    contentProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        // The scrollable width is fully synthetic: every horizontally-pinned section
        // is viewport-sized, so none of the in-flow children spans the columns width.
        // Floored at the inner viewport width
        width: Math.max(dimensions.columnsTotalWidth, dimensions.viewportInnerSize.width),
        position: 'relative',
        // Reserve the virtual scrollbar lanes in the scrollable area, so the last
        // row/column can scroll out from under the overlaid scrollbar widgets. Only
        // when the axis scrolls, otherwise the lane itself would create overflow.
        // `content-box` so the lanes add to the columns width.
        boxSizing: 'content-box',
        paddingBottom:
          dimensions.hasScrollY && dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
        paddingRight: dimensions.hasScrollX && dimensions.hasScrollY ? dimensions.scrollbarSize : 0,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    topContainerProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        position: 'sticky',
        top: 0,
        // Horizontally pinned to the scrollport, like the window: otherwise the
        // container would move with the horizontal scroll in addition to its
        // positioner's translation, making its content scroll at twice the rate.
        left: 0,
        width: dimensions.viewportInnerSize.width,
        overflow: 'hidden',
        zIndex: 2,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    bottomContainerProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        position: 'sticky',
        // Lifted above the horizontal scrollbar lane.
        bottom: dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
        // Horizontally pinned, same as the top container.
        left: 0,
        width: dimensions.viewportInnerSize.width,
        overflow: 'hidden',
        zIndex: 2,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    scrollbarVerticalProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.dimensions,
      (context, dimensions) => {
        // On platforms with overlay scrollbars the measured size is 0: the lanes
        // collapse but the floating widget still needs a hit area.
        const size = Math.max(dimensions.scrollbarSize, 14);
        return {
          ref: context.scrollbarVerticalRef,
          style: {
            position: 'absolute',
            top: dimensions.topContainerHeight,
            right: 0,
            bottom: dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
            // Collapsed rather than `display: none` when unused: the scrollbar size
            // measurement probes inside this element, which requires it rendered.
            width: dimensions.hasScrollY ? size : 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            zIndex: 3,
          } as React.CSSProperties,
          // Sized so that the scrollbar's scroll range matches the scroller's exactly,
          // allowing 1:1 position mirroring.
          contentStyle: {
            width: 1,
            height: dimensions.hasScrollY
              ? dimensions.contentSize.height + dimensions.bottomContainerHeight
              : 0,
          } as React.CSSProperties,
          'aria-hidden': true,
        };
      },
    ),

    scrollbarHorizontalProps: createSelectorMemoized(
      Virtualization.selectors.context,
      Dimensions.selectors.dimensions,
      (context, dimensions) => {
        const size = Math.max(dimensions.scrollbarSize, 14);
        return {
          ref: context.scrollbarHorizontalRef,
          style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: dimensions.hasScrollY ? dimensions.scrollbarSize : 0,
            height: dimensions.hasScrollX ? size : 0,
            overflowX: 'auto',
            overflowY: 'hidden',
            zIndex: 3,
          } as React.CSSProperties,
          contentStyle: {
            height: 1,
            width: dimensions.hasScrollX ? dimensions.columnsTotalWidth : 0,
          } as React.CSSProperties,
          'aria-hidden': true,
        };
      },
    ),

    positionerProps: createSelectorMemoized(
      Virtualization.selectors.pinnedLeftOffsetSelector,
      (scrollLeft) => ({
        style: {
          transform: `translate3d(${-scrollLeft}px, 0, 0)`,
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    spacerTopProps: createSelectorMemoized(
      Virtualization.selectors.renderContext,
      Dimensions.selectors.rowPositions,
      (renderContext, rowPositions) => ({
        style: {
          height: rowPositions[renderContext.firstRowIndex] ?? 0,
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    spacerBottomProps: createSelectorMemoized(
      Virtualization.selectors.renderContext,
      Dimensions.selectors.rowPositions,
      Dimensions.selectors.contentHeight,
      (renderContext, rowPositions, contentHeight) => ({
        style: {
          height: contentHeight - (rowPositions[renderContext.lastRowIndex] ?? contentHeight),
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    windowProps: createSelectorMemoized(
      Virtualization.selectors.renderContext,
      Dimensions.selectors.rowPositions,
      Dimensions.selectors.contentHeight,
      Dimensions.selectors.dimensions,
      (renderContext, rowPositions, contentHeight, dimensions) => {
        const firstPosition = rowPositions[renderContext.firstRowIndex] ?? 0;
        const lastPosition = rowPositions[renderContext.lastRowIndex] ?? contentHeight;
        const renderedHeight = lastPosition - firstPosition;

        const { viewportInnerSize, topContainerHeight, bottomContainerHeight } = dimensions;
        const horizontalScrollbarLane = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
        // Asymmetric offsets: scrolling down, the window's bottom edge clamps at the
        // top of the bottom container; scrolling up, its top edge clamps below the
        // top container. Derivation: native scrollbars are hidden so the scrollport
        // height is `P = viewportInnerSize.height + topContainerHeight +
        // bottomContainerHeight + horizontalScrollbarLane`, and the offsets are
        // `-(renderedHeight - (P - horizontalScrollbarLane - bottomContainerHeight))`
        // and `-(renderedHeight - (P - topContainerHeight))`, which simplify to the
        // expressions below.
        const stickyTop = Math.min(
          0,
          -(renderedHeight - (viewportInnerSize.height + topContainerHeight)),
        );
        const stickyBottom = Math.min(
          0,
          -(
            renderedHeight -
            (viewportInnerSize.height + bottomContainerHeight + horizontalScrollbarLane)
          ),
        );

        return {
          style: {
            position: 'sticky',
            top: stickyTop,
            bottom: stickyBottom,
            // Horizontal axis is controlled: the window is pinned to the scrollport and
            // sized to the viewport, the positioner inside translates by `-scrollLeft`.
            left: 0,
            width: viewportInnerSize.width,
            overflow: 'hidden',
            // Explicit height: keeps the sticky clamping math immune to flow height
            // discrepancies from out-of-flow children (detail panels, focus rows).
            height: renderedHeight,
          } as React.CSSProperties,
          role: 'presentation',
        };
      },
    ),
  };
}

type ScrollProperty = 'scrollTop' | 'scrollLeft';

function useScrollbarRefCallback(
  scrollerRef: React.RefObject<HTMLElement | null>,
  refSetter: (node: HTMLDivElement | null) => void,
  scrollProperty: ScrollProperty,
  updateDimensions: () => void,
) {
  const isLocked = React.useRef(false);
  const lastPosition = React.useRef(0);

  const handleScrollerScroll = useEventCallback((scrollbar: HTMLElement) => {
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

  const handleScrollbarScroll = useEventCallback((scrollbar: HTMLElement) => {
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
    updateDimensions();

    const scroller = scrollerRef.current;
    if (!scroller) {
      return () => {
        refSetter(null);
      };
    }

    const onScrollerScroll = () => handleScrollerScroll(scrollbar);
    const onScrollbarScroll = () => handleScrollbarScroll(scrollbar);

    const options: AddEventListenerOptions = { passive: true };
    scroller.addEventListener('scroll', onScrollerScroll, options);
    scrollbar.addEventListener('scroll', onScrollbarScroll, options);

    return () => {
      scroller.removeEventListener('scroll', onScrollerScroll);
      scrollbar.removeEventListener('scroll', onScrollbarScroll);
      refSetter(null);
    };
  });
}

function cssAdd(a: string | number | undefined, b: string | number | undefined) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  return `calc(${valueToCSSString(a)} + ${valueToCSSString(b)})`;
}

function cssMax(a: string | number | undefined, b: string | number | undefined) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.max(a, b);
  }
  return `max(${valueToCSSString(a)}, ${valueToCSSString(b)})`;
}

function valueToCSSString(value: string | number | undefined) {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'undefined') {
    return '0';
  }
  return `${value}px`;
}
