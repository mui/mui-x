'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { createSelectorMemoized } from '@base-ui/utils/store';
import type { BaseState } from '../../useVirtualizer';
import type { Scrolling } from '../scrolling';
import type { VirtualizationLayoutParams } from './virtualization';
import useRefCallback from '../../utils/useRefCallback';

// Layout selectors depend on sizing, not pixel scroll offsets. Scrolling within a
// rendered buffer must not invalidate the props of every wrapper.
export const scrollLayoutGeometry = createSelectorMemoized(
  (state: BaseState) => state.scrolling.external,
  (state: BaseState) => state.scrolling.bothAxes,
  (state: BaseState) => state.scrolling.insets.top,
  (state: BaseState) => state.scrolling.insets.right,
  (state: BaseState) => state.scrolling.insets.bottom,
  (state: BaseState) => state.scrolling.insets.left,
  (state: BaseState) => state.dimensions,
  (external, bothAxes, top, right, bottom, left, dimensions) => {
    const split = external && !bothAxes;
    const lane = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
    return {
      external,
      split,
      insets: external ? { top, right, bottom, left } : { top: 0, right: 0, bottom: 0, left: 0 },
      width: Math.max(dimensions.columnsTotalWidth, dimensions.root.width),
      height:
        dimensions.topContainerHeight +
        dimensions.contentSize.height +
        dimensions.bottomContainerHeight +
        lane,
      lane,
      scrollbarHeight: split && dimensions.hasScrollX ? Math.max(14, lane) : 0,
      dimensions,
    };
  },
);

export function useScrollLayout(
  api: Pick<Scrolling.API, 'registerHorizontalScroller'>,
  { containerRef, scrollerRef }: VirtualizationLayoutParams,
) {
  // Keep React's private ref-cleanup return types out of the emitted declarations.
  const mergedRef: ((node: HTMLDivElement | null) => void | (() => void)) | null = useForkRef(
    containerRef,
    scrollerRef,
  );
  const headerScrollerRef = useRefCallback(api.registerHorizontalScroller);
  const footerScrollerRef = useRefCallback(api.registerHorizontalScroller);
  const horizontalScrollbarRef = useRefCallback(api.registerHorizontalScroller);
  return {
    containerRef,
    scrollerRef,
    mergedRef,
    headerScrollerRef,
    footerScrollerRef,
    horizontalScrollbarRef,
  };
}

const context = (state: BaseState) =>
  state.virtualization.context as ReturnType<typeof useScrollLayout>;

export function externalContainerStyle(
  scrollLayout: ReturnType<typeof scrollLayoutGeometry>,
): React.CSSProperties | undefined {
  return scrollLayout.external
    ? ({
        height: 'auto',
        overflowX: 'visible',
        overflowY: 'visible',
        overflowAnchor: 'none',
        width: scrollLayout.split ? '100%' : scrollLayout.dimensions.columnsTotalWidth || '100%',
        minWidth: scrollLayout.split ? undefined : '100%',
        '--virtualizer-pinned-left': `${scrollLayout.split ? 0 : scrollLayout.insets.left}px`,
        '--virtualizer-pinned-right': `${scrollLayout.split ? 0 : scrollLayout.insets.right}px`,
      } as React.CSSProperties)
    : undefined;
}

function horizontalScrollerStyle(split: boolean): React.CSSProperties | undefined {
  return split
    ? {
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: 1,
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
      }
    : undefined;
}

// These optional wrappers live INSIDE vertical sticky bands. A horizontal
// scrollport outside a band would also capture its vertical sticky positioning.
export const scrollBandSelectors = {
  headerScrollerProps: createSelectorMemoized(
    context,
    scrollLayoutGeometry,
    (refs, scrollLayout) => ({
      ref: scrollLayout.split ? refs.headerScrollerRef : undefined,
      style: horizontalScrollerStyle(scrollLayout.split),
    }),
  ),
  footerScrollerProps: createSelectorMemoized(
    context,
    scrollLayoutGeometry,
    (refs, scrollLayout) => ({
      ref: scrollLayout.split ? refs.footerScrollerRef : undefined,
      style: horizontalScrollerStyle(scrollLayout.split),
    }),
  ),
  bodyScrollerProps: createSelectorMemoized(
    context,
    scrollLayoutGeometry,
    (refs, scrollLayout) => ({
      ref: scrollLayout.split ? refs.scrollerRef : undefined,
      style: horizontalScrollerStyle(scrollLayout.split),
    }),
  ),
  scrollCanvasProps: createSelectorMemoized(scrollLayoutGeometry, (scrollLayout) => ({
    style: {
      width: scrollLayout.width,
      height: '100%',
      position: 'relative',
    } as React.CSSProperties,
  })),
  scrollbarContentProps: createSelectorMemoized(scrollLayoutGeometry, (scrollLayout) => ({
    style: { width: scrollLayout.width, height: 1 },
  })),
};

export const horizontalScrollbarProps = createSelectorMemoized(
  context,
  scrollLayoutGeometry,
  (refs, scrollLayout) => ({
    ref: scrollLayout.split ? refs.horizontalScrollbarRef : undefined,
    style: {
      position: 'sticky',
      bottom: scrollLayout.insets.bottom,
      height: scrollLayout.scrollbarHeight,
      marginTop: -scrollLayout.scrollbarHeight,
      overflowX: 'auto',
      overflowY: 'hidden',
      width: '100%',
      zIndex: 3,
      visibility: scrollLayout.scrollbarHeight ? 'visible' : 'hidden',
    } as React.CSSProperties,
  }),
);

export const pinnedBandSelectors = {
  topContainerProps: createSelectorMemoized(scrollLayoutGeometry, (scrollLayout) => ({
    style: {
      position: 'sticky',
      top: scrollLayout.insets.top,
      height: scrollLayout.dimensions.topContainerHeight,
      zIndex: 2,
    } as React.CSSProperties,
  })),
  bottomContainerProps: createSelectorMemoized(scrollLayoutGeometry, (scrollLayout) => ({
    style: {
      position: 'sticky',
      bottom: scrollLayout.insets.bottom + scrollLayout.lane,
      height: scrollLayout.dimensions.bottomContainerHeight,
      zIndex: 2,
    } as React.CSSProperties,
  })),
};

export const remainingRowHeight = createSelectorMemoized(
  (state: BaseState) => state.rowsMeta.positions,
  (state: BaseState) => state.dimensions.contentSize.height,
  (state: BaseState) => state.virtualization.renderContext.lastRowIndex,
  (positions, contentHeight, lastRow) =>
    Math.max(0, contentHeight - (positions[lastRow] ?? contentHeight)),
);
