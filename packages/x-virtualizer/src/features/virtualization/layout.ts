'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { platform } from '@base-ui/utils/platform';
import { Store, createSelectorMemoized } from '@mui/x-internals/store';
import type { ColumnWithWidth } from '../../models';
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
 * Paint-stable window content.
 *
 * The rendered rows paint into a composited layer, and the compositor re-rasterizes
 * every region whose paint offset within its layer changed. Each render context update
 * moves the window in the flow (the spacers track the new offset), so if the rows
 * painted into the window's own layer, every retained row would shift inside it and the
 * whole window would re-rasterize on every update. Fast scrolling exposes that as blank
 * frames at the leading edge: a whole-window raster cannot complete within a frame
 * interval, and the lower the display refresh rate, the more pixels each frame interval
 * covers.
 *
 * The rows therefore render inside a dedicated `windowContent` box that keeps its own
 * anchored local space: `paddingTop` places the rows at `offsetTop - anchor`, where the
 * anchor moves only in `ANCHOR_BLOCK` steps, and a `translateY` of the same magnitude
 * cancels the pad visually. The rows already paint into the composited layer of the
 * sticky window, and the pad holds their offsets inside it fixed across updates, so only
 * entering rows rasterize. When the offset crosses into another anchor block the pad
 * wraps, costing one whole-window raster per `ANCHOR_BLOCK` of travel instead of one per
 * update.
 *
 * Promoting the box itself (`will-change: transform`) is deliberately avoided: measured
 * against the layer trees Chromium builds for this layout it changes no invalidation —
 * the sticky window is composited either way — while it does disable subpixel text
 * antialiasing on the platforms that use it, and raises peak tile memory. Painting a
 * background on this box is worse still: the pad region becomes painted content, so
 * every pad change invalidates the whole box and the optimization is lost entirely.
 *
 * The sticky window and the spacers keep tracking the exact offsets: the sticky clamp
 * may only move an element within its containing block, so holding stale content
 * during backward overshoot needs the slack of the element's real flow position — the
 * anchoring must live entirely inside `windowContent`.
 *
 * Vertical only: the counter-translation sits on an ancestor of the sticky pinned
 * cells, and sticky offsets are resolved in layout coordinates before transforms
 * apply, so a horizontal translation would displace the pinned cells' clamped
 * position. Column-direction updates keep repositioning the cells within the layer
 * (whole-window raster), like before.
 *
 * The block size bounds the `windowContent` box (up to `ANCHOR_BLOCK` + rendered
 * size): larger blocks mean rarer whole-window rasters but a larger layer box for the
 * compositor to track. Tiles only rasterize near the visible area, so the cost is tile
 * bookkeeping rather than raster memory proportional to the box — but it isn't free:
 * a box much taller than the rendered window measurably raises peak tile memory.
 */
const ANCHOR_BLOCK = 40_000;

function quantizeAnchor(offset: number) {
  return Math.floor(offset / ANCHOR_BLOCK) * ANCHOR_BLOCK;
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
 * The rows render inside a `windowContent` box that keeps them paint-stable across
 * render context updates (see the paint-stable window content comment above).
 *
 * Expected DOM structure:
 * ```tsx
 * <div {...containerProps}>         // scroller
 *   <div {...contentProps}>         // in-flow, full content height, sticky containing block
 *     <div {...positionerProps} />  // spacer, height: offsetTop
 *     <div {...windowProps}>        // sticky rendered window
 *       <div {...windowContentProps}>  // anchored local space for the rows
 *         {rows}
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 */
export class LayoutListSticky extends Layout<ListElements> {
  static elements = [
    'scroller',
    'container',
    'content',
    'positioner',
    'window',
    'windowContent',
  ] as const;

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
            // Explicit height: the windowContent child's box includes the anchor pad,
            // so an auto height would balloon the sticky box and derail the clamping
            // math above. The windowContent overflows this box; the pad region is
            // empty and its translation cancels the visual difference.
            height: renderedHeight,
          } as React.CSSProperties,
        };
      },
    ),

    windowContentProps: createSelectorMemoized(Virtualization.selectors.offsetTop, (offsetTop) => {
      const padTop = offsetTop - quantizeAnchor(offsetTop);
      return {
        style: {
          // Anchored local space (see the paint-stable window content comment above):
          // the pad places the rows at their offset from the anchor within this box and
          // the translation cancels it visually, holding the rows at fixed offsets in
          // the layer they paint into.
          paddingTop: padTop,
          transform: `translateY(${-padTop}px)`,
        } as React.CSSProperties,
        role: 'presentation',
      };
    }),
  };
}

/**
 * Grid layout based on the "inverse sticky" technique, applied to both axes and
 * extended with pinned sections. Each axis places the rendered window in the flow at
 * the rendered cells' offset and gives it `position: sticky` with negative insets, so
 * the browser moves it natively within the directional buffer and clamps it to stale
 * content (never blank) beyond.
 *
 * The window needs `content` as its containing block on both axes (for the full clamp
 * range), so the axes are nested rather than combined on one element:
 * - the `window` is a block child of `content`, `position: sticky` (vertical insets),
 *   and a `display: flex` row spanning the full content width;
 * - a `spacerLeft` (`flex: 0 0 offsetLeft`) offsets an `innerWindow`
 *   (`flex: 0 0 renderedWidth`, `position: sticky` horizontal insets) whose containing
 *   block is that full-width flex row.
 * The top/bottom containers mirror this with a `spacerLeft` + horizontally-sticky
 * `innerContainer`, so headers/pinned rows clamp in lockstep with the window and stay
 * column-aligned. Pinned column cells are `position: sticky` in the normal flow of
 * their row; the pinned-right inset includes the vertical scrollbar lane.
 *
 * The rows render inside a `windowContent` box that keeps them paint-stable across
 * render context updates (see the paint-stable window content comment above).
 *
 * Scrolling relies on virtual scrollbars, like the DataGrid: the scroller hides its
 * native scrollbars and standalone scrollbar widgets are kept in sync with it (see
 * `useScrollbarRefCallback`). The content reserves the scrollbar lanes so the last
 * row/column can scroll out from under the overlaid widgets, and the scroller clips
 * them back out of the scrollport so nothing paints in them (see `scrollerProps`).
 *
 * The horizontal-geometry selectors take the columns array as a selector argument:
 * `store.use(LayoutGridSticky.selectors.innerWindowProps, columns)`.
 *
 * Expected DOM structure:
 * ```tsx
 * <div {...containerProps}>                // outer wrapper (position: relative)
 *   <div {...scrollerProps}>               // scroller, native scrollbars hidden
 *     <div {...contentProps}>              // in-flow, sticky containing block
 *       <div {...topContainerProps}>       // sticky top + flex: headers, pinned rows
 *         <div {...spacerLeftProps} />     // flex: 0 0 offsetLeft
 *         <div {...innerContainerProps}>   // flex item, horizontally-sticky
 *           {header, pinned top rows}
 *         </div>
 *       </div>
 *       <div {...spacerTopProps} />        // height: rowPositions[firstRowIndex]
 *       <div {...windowProps}>             // sticky (vertical) + flex row
 *         <div {...spacerLeftProps} />     // flex: 0 0 offsetLeft
 *         <div {...innerWindowProps}>      // flex item, horizontally-sticky
 *           <div {...windowContentProps}>  // anchored local space for the rows
 *             {rows}
 *           </div>
 *         </div>
 *       </div>
 *       <div {...spacerBottomProps} />     // height: remaining content height
 *       <div {...bottomContainerProps}>    // sticky bottom + flex: pinned bottom rows
 *         <div {...spacerLeftProps} />
 *         <div {...innerContainerProps}>
 *           {pinned bottom rows}
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 *   <div {...scrollbarVerticalProps} />    // virtual scrollbars, overlaid
 *   <div {...scrollbarHorizontalProps} />
 * </div>
 * ```
 */
/**
 * Horizontal offset (the `spacerLeft` basis), rendered width and inverse-sticky insets
 * of the window. Mirror of `verticalGeometry`: `left` clamps the window's right edge at
 * the inner viewport's right edge (left of the vertical scrollbar lane), `right` clamps
 * its left edge at the scrollport's left edge.
 */
const horizontalGeometry = createSelectorMemoized(
  Virtualization.selectors.renderContext,
  Dimensions.selectors.dimensions,
  Dimensions.selectors.columnPositions,
  (renderContext, dimensions, columnPositions, _columns: ColumnWithWidth[]) => {
    const { leftPinnedWidth, rightPinnedWidth, columnsTotalWidth, viewportInnerSize } = dimensions;
    const firstPosition = columnPositions[renderContext.firstColumnIndex] ?? 0;
    // `lastColumnIndex` is exclusive: past the last column, the window extends to the
    // pinned-right section (or the content end when there is none).
    const lastPosition =
      columnPositions[renderContext.lastColumnIndex] ?? columnsTotalWidth - rightPinnedWidth;
    // Pinned cells are in the row flow, so they count toward the rendered width and
    // the offset starts at the pinned-left cells.
    const renderedWidth = leftPinnedWidth + (lastPosition - firstPosition) + rightPinnedWidth;
    const offsetLeft = firstPosition - leftPinnedWidth;
    const verticalScrollbarLane = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
    // Clamped to 0: if the rendered window is smaller than the viewport (few
    // columns), sticky positioning must stay inert.
    const stickyLeft = Math.min(0, -(renderedWidth - viewportInnerSize.width));
    const stickyRight = Math.min(
      0,
      -(renderedWidth - (viewportInnerSize.width + verticalScrollbarLane)),
    );
    return { offsetLeft, renderedWidth, stickyLeft, stickyRight };
  },
);

/**
 * Vertical offset (the `spacerTop` basis), rendered height, inverse-sticky insets of
 * the window, and the `windowContent` anchor pad. Vertical mirror of
 * `horizontalGeometry`. Asymmetric insets: scrolling down, the window's bottom edge
 * clamps at the top of the bottom container; scrolling up, its top edge clamps below
 * the top container. Derivation: native scrollbars are hidden so the scrollport height
 * is `P = viewportInnerSize.height + topContainerHeight + bottomContainerHeight +
 * horizontalScrollbarLane`, and the insets
 * `-(renderedHeight - (P - horizontalScrollbarLane - bottomContainerHeight))` and
 * `-(renderedHeight - (P - topContainerHeight))` simplify to the expressions below.
 */
const verticalGeometry = createSelectorMemoized(
  Virtualization.selectors.renderContext,
  Dimensions.selectors.rowPositions,
  Dimensions.selectors.contentHeight,
  Dimensions.selectors.dimensions,
  (renderContext, rowPositions, contentHeight, dimensions) => {
    const { viewportInnerSize, topContainerHeight, bottomContainerHeight } = dimensions;
    const firstPosition = rowPositions[renderContext.firstRowIndex] ?? 0;
    // `lastRowIndex` is exclusive: when it points past the last row, the window extends
    // to the end of the content.
    const lastPosition = rowPositions[renderContext.lastRowIndex] ?? contentHeight;
    const renderedHeight = lastPosition - firstPosition;
    const offsetTop = firstPosition;
    const padTop = offsetTop - quantizeAnchor(offsetTop);
    const horizontalScrollbarLane = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
    // Clamped to 0: if the rendered window is smaller than the viewport (few rows),
    // sticky positioning must stay inert.
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
    return { offsetTop, padTop, renderedHeight, stickyTop, stickyBottom };
  },
);

export class LayoutGridSticky extends Layout<DataGridElements> {
  static elements = [
    'scroller',
    'container',
    'content',
    'topContainer',
    'spacerLeft',
    'innerContainer',
    'spacerTop',
    'window',
    'innerWindow',
    'windowContent',
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
      Dimensions.selectors.dimensions,
      (context, autoHeight, dimensions) => {
        const verticalLane = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
        const horizontalLane = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
        return {
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
            // The scrollbar lanes are reserved inside the scrollable area (see
            // `contentProps`), so the scrollport spans them and the rendered window —
            // wider than the viewport by its column buffer — paints into them. The
            // widgets hide most of that, but they stop short of the lane beside the top
            // container and of the corner between them, where the rows would show
            // through. Clipping the scrollport back to the visible area covers every
            // such region at once and leaves the lanes showing the container, the way
            // they looked when each sticky box clipped itself to the inner viewport.
            // Trade-off: the clipped strips stop taking pointer events — the widget
            // covers the vertical lane, and the corner is inert like a native one.
            // Omitted when neither lane is reserved (overlay scrollbars measure 0), so
            // the scroller doesn't become a stacking context for nothing.
            clipPath:
              verticalLane || horizontalLane
                ? `inset(0 ${verticalLane}px ${horizontalLane}px 0)`
                : undefined,
          } as React.CSSProperties,
          role: 'presentation',
          // `tabIndex` shouldn't be used along role=presentation, but it fixes a Firefox bug
          // https://github.com/mui/mui-x/pull/13891#discussion_r1683416024
          tabIndex: platform.engine.gecko ? -1 : undefined,
        };
      },
    ),

    contentProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        // The full columns width: the flex children (spacers + inner boxes) don't
        // stretch their containing blocks, so the content sets the scrollable width.
        // Floored at the inner viewport width.
        width: Math.max(dimensions.columnsTotalWidth, dimensions.viewportInnerSize.width),
        // Before the viewport is measured `viewportInnerSize` is empty, so the floor in
        // `width` above is zero and it collapses to `columnsTotalWidth`. When the columns
        // are narrower than the scroller that leaves white space beside the rows on the
        // first paint. Floor the content at the scroller width until measured; once
        // `isReady`, `width` already floors at `viewportInnerSize.width`, and a lingering
        // `minWidth` on top of that would re-create a horizontal scroll dead zone.
        ...(dimensions.isReady ? null : { minWidth: '100%' }),
        position: 'relative',
        // Reserve the virtual scrollbar lanes in the scrollable area, so the last
        // row/column can scroll out from under the overlaid scrollbar widgets. Each lane
        // is reserved whenever its own axis scrolls — the bottom lane (horizontal
        // scrollbar) off `hasScrollX`, the right lane (vertical scrollbar) off `hasScrollY`
        // — otherwise the lane itself would create overflow. Gating both on
        // `hasScrollX && hasScrollY` is wrong: `hasScrollY` already folds in the horizontal
        // lane (`content.height + scrollbarSize > container.height` whenever `hasScrollX`),
        // so for a content-sized scroller the two states feed each other with no stable
        // fixpoint and the layout oscillates under classic scrollbars.
        // `content-box` so the lanes add to the columns width.
        boxSizing: 'content-box',
        paddingBottom: dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
        paddingRight: dimensions.hasScrollY ? dimensions.scrollbarSize : 0,
        // Inset for sticky pinned-right cells: they stick against the scrollport, which
        // spans under the overlaid vertical scrollbar (native scrollbars hidden), so
        // this lifts them to the visible inner edge. Consumed as `right: var(--pinned-right)`.
        '--pinned-right': `${dimensions.hasScrollY ? dimensions.scrollbarSize : 0}px`,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    topContainerProps: createSelectorMemoized(() => ({
      style: {
        position: 'sticky',
        top: 0,
        // Full-width flex row (nowrap): its content box is the innerContainer's sticky
        // containing block, so the innerContainer clamps across the full scroll range.
        display: 'flex',
        flexWrap: 'nowrap',
        zIndex: 2,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    bottomContainerProps: createSelectorMemoized(Dimensions.selectors.dimensions, (dimensions) => ({
      style: {
        position: 'sticky',
        // Lifted above the horizontal scrollbar lane.
        bottom: dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
        display: 'flex',
        flexWrap: 'nowrap',
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

    // Horizontal offset spacer: gives the sticky sibling leftward slack to clamp into
    // (the horizontal analog of `spacerTop`).
    spacerLeftProps: createSelectorMemoized(
      horizontalGeometry,
      (geometry, _columns: ColumnWithWidth[]) => ({
        style: {
          flex: `0 0 ${geometry.offsetLeft}px`,
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    // Horizontally-sticky inner box of the top/bottom containers, holding the header
    // and pinned rows (the container's analog of `innerWindow`).
    innerContainerProps: createSelectorMemoized(
      horizontalGeometry,
      (geometry, _columns: ColumnWithWidth[]) => ({
        style: {
          flex: `0 0 ${geometry.renderedWidth}px`,
          position: 'sticky',
          left: geometry.stickyLeft,
          right: geometry.stickyRight,
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    spacerTopProps: createSelectorMemoized(verticalGeometry, (geometry) => ({
      style: {
        height: geometry.offsetTop,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    spacerBottomProps: createSelectorMemoized(
      verticalGeometry,
      Dimensions.selectors.contentHeight,
      (geometry, contentHeight) => ({
        style: {
          height: contentHeight - (geometry.offsetTop + geometry.renderedHeight),
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    windowProps: createSelectorMemoized(verticalGeometry, (geometry) => ({
      style: {
        // Vertical axis: sticky against `content` (full-height containing block).
        position: 'sticky',
        top: geometry.stickyTop,
        bottom: geometry.stickyBottom,
        // Horizontal axis: a flex row (nowrap) holding the spacerLeft + innerWindow.
        // Its content box is the innerWindow's sticky containing block, so the
        // innerWindow clamps across the full scroll range.
        display: 'flex',
        flexWrap: 'nowrap',
        // Explicit height: keeps the vertical clamping math immune to flow height
        // discrepancies from out-of-flow children (detail panels, focus rows).
        height: geometry.renderedHeight,
      } as React.CSSProperties,
      role: 'presentation',
    })),

    innerWindowProps: createSelectorMemoized(
      horizontalGeometry,
      verticalGeometry,
      (horizontal, vertical, _columns: ColumnWithWidth[]) => ({
        style: {
          flex: `0 0 ${horizontal.renderedWidth}px`,
          position: 'sticky',
          left: horizontal.stickyLeft,
          right: horizontal.stickyRight,
          // Matches the window height so the rows fill it (rows use `width: 100%`).
          height: vertical.renderedHeight,
        } as React.CSSProperties,
        role: 'presentation',
      }),
    ),

    windowContentProps: createSelectorMemoized(verticalGeometry, (geometry) => ({
      style: {
        // Anchored local space (see the paint-stable window content comment above):
        // the pad places the rows at their offset from the anchor within this box and
        // the translation cancels it visually, holding the rows at fixed offsets in the
        // layer they paint into.
        paddingTop: geometry.padTop,
        transform: `translateY(${-geometry.padTop}px)`,
      } as React.CSSProperties,
      role: 'presentation',
    })),
  };
}

type ScrollProperty = 'scrollTop' | 'scrollLeft';

function useScrollbarRefCallback(
  scrollerRef: React.RefObject<HTMLElement | null>,
  refSetter: (node: HTMLDivElement | null) => void,
  scrollProperty: ScrollProperty,
  updateDimensions: () => void,
) {
  // Scroll events are asynchronous and only expose the element's current position.
  // Track programmatic writes by position so their echoes don't suppress newer input.
  const programmaticScrollerPosition = React.useRef<number | null>(null);
  const programmaticScrollbarPosition = React.useRef<number | null>(null);

  const handleScrollerScroll = useEventCallback((scrollbar: HTMLElement) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const scrollerPosition = scroller[scrollProperty];
    if (programmaticScrollerPosition.current === scrollerPosition) {
      return;
    }
    programmaticScrollerPosition.current = null;

    if (scrollbar[scrollProperty] !== scrollerPosition) {
      programmaticScrollbarPosition.current = scrollerPosition;
      scrollbar[scrollProperty] = scrollerPosition;
    }
  });

  const handleScrollbarScroll = useEventCallback((scrollbar: HTMLElement) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const scrollbarPosition = scrollbar[scrollProperty];
    if (programmaticScrollbarPosition.current === scrollbarPosition) {
      return;
    }
    programmaticScrollbarPosition.current = null;

    if (scroller[scrollProperty] !== scrollbarPosition) {
      programmaticScrollerPosition.current = scrollbarPosition;
      scroller[scrollProperty] = scrollbarPosition;
    }
  });

  return useRefCallback((scrollbar) => {
    programmaticScrollerPosition.current = null;
    programmaticScrollbarPosition.current = null;
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
