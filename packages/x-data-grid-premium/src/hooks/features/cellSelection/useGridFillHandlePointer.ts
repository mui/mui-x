'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import ownerWindow from '@mui/utils/ownerWindow';
import useEventCallback from '@mui/utils/useEventCallback';
import { gridClasses, gridDimensionsSelector } from '@mui/x-data-grid-pro';
import {
  FILL_HANDLE_IMMEDIATE_TOUCH_DRAG,
  getEdgeScrollDelta,
  getElementAtPoint,
  getVisibleViewportBounds,
  hasReachedAutoScrollDistance,
  isElementInGrid,
  isPointerDragType,
  useGridRootNativeEventListener,
  usePointerDrag,
} from '@mui/x-data-grid-pro/internals';
import type { PointerDragPosition } from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  applyFill,
  clearFillPreview,
  createFillSource,
  decorateFillPreview,
  getFillTargetCell,
  getFillTargets,
  isPointerOnFillHandle,
} from './fillHandleUtils';
import type { FillProps, FillSourceState, FillTargets } from './fillHandleUtils';

// Centered on the handle corner. WCAG 2.5.8 asks for 24px at least.
const FILL_HANDLE_TOUCH_HIT_AREA = 32;

// The touch hit area is found from the position of the cell, not from the pressed element.
// A cell rendered out of view, in the overscan or scrolled under the headers, the footer, or the
// pinned rows and columns, keeps its position: a press there must not grab its hidden handle.
function isFillHandleVisible(root: HTMLElement, cell: HTMLElement, isRtl: boolean) {
  const rect = cell.getBoundingClientRect();
  const elementAtCorner = getElementAtPoint(
    root,
    isRtl ? rect.left + 1 : rect.right - 1,
    rect.bottom - 1,
  );
  return !!elementAtCorner && cell.contains(elementAtCorner);
}

interface FillDragSession {
  source: FillSourceState;
  targets: FillTargets;
  decoratedElements: Set<Element>;
  startClientX: number;
  startClientY: number;
  clientX: number;
  clientY: number;
  // Off until the pointer moves away from where the drag started
  canAutoScroll: boolean;
  frame: number | undefined;
}

/**
 * Drag to fill with pointer events, for touch and pen input.
 * Mouse input keeps the mouse events of `useGridCellSelection`.
 * @requires useGridCellSelection (method)
 */
export const useGridFillHandlePointer = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'cellSelection' | 'cellSelectionFillHandle'> &
    FillProps,
): void => {
  const sessionRef = React.useRef<FillDragSession | null>(null);
  const isEnabled = !!props.cellSelection && !!props.cellSelectionFillHandle;

  // A nested grid, for example in a detail panel, can show its own handle
  const getFillHandleCell = (root: HTMLElement): HTMLElement | null => {
    const cells = root.querySelectorAll<HTMLElement>(`.${gridClasses['cell--withFillHandle']}`);
    const cell = Array.from(cells).find((element) => isElementInGrid(root, element));
    if (!cell || cell.classList.contains(gridClasses['cell--editing'])) {
      return null;
    }
    return cell;
  };

  // Outside of the cells of this grid, the fill keeps its last target, like with a mouse
  const updateTargets = (session: FillDragSession, elementAtPoint: Element | null) => {
    const root = apiRef.current.rootElementRef?.current;
    const cell = elementAtPoint?.closest(`.${gridClasses.cell}`);
    if (!cell || !isElementInGrid(root, cell)) {
      return;
    }
    const targetCell = getFillTargetCell([cell], session.source.rowIdMap);
    if (targetCell) {
      session.targets = getFillTargets(apiRef, session.source, targetCell);
    }
  };

  const stopSession = (session: FillDragSession) => {
    cancelAnimationFrame(session.frame!);
    clearFillPreview(session.decoratedElements);
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
    if (sessionRef.current === session) {
      sessionRef.current = null;
    }
  };

  const autoScroll = (session: FillDragSession, root: HTMLElement, scroller: HTMLElement) => {
    const rect = scroller.getBoundingClientRect();
    const dimensions = gridDimensionsSelector(apiRef);
    const isRtl = apiRef.current.state.isRtl;
    const scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
    const scrollbarHeight = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
    // The edges of the scrollable cells, inside of the headers, the pinned rows and columns, and the scrollbars.
    // In RTL, the left pinned columns are on the right side and the vertical scrollbar on the left.
    const cellsTop = rect.top + dimensions.topContainerHeight;
    const cellsBottom = rect.bottom - dimensions.bottomContainerHeight - scrollbarHeight;
    const cellsLeft =
      rect.left +
      (isRtl ? dimensions.rightPinnedWidth + scrollbarWidth : dimensions.leftPinnedWidth);
    const cellsRight =
      rect.right -
      (isRtl ? dimensions.leftPinnedWidth : dimensions.rightPinnedWidth + scrollbarWidth);
    // The page doesn't scroll during a touch drag, so a zone off-screen couldn't be reached
    const win = ownerWindow(root);
    const viewport = getVisibleViewportBounds(win);
    const deltaY = getEdgeScrollDelta(
      session.clientY,
      Math.max(cellsTop, viewport.top),
      Math.min(cellsBottom, viewport.bottom),
    );
    const deltaX = getEdgeScrollDelta(
      session.clientX,
      Math.max(cellsLeft, viewport.left),
      Math.min(cellsRight, viewport.right),
    );
    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    const { top, left } = apiRef.current.getScrollPosition();
    // Only the axis that moves is passed, so the other one can't jump.
    // `scroll` takes the distance from the start edge and flips it in RTL, where `scrollLeft` is negative.
    apiRef.current.scroll({
      ...(deltaY !== 0 && { top: top + deltaY }),
      ...(deltaX !== 0 && { left: (isRtl ? -1 : 1) * (left + deltaX) }),
    });

    // The grid can't scroll further, or at all with `autoHeight`: scroll the page when the pointer is at the edge of the screen
    const position = apiRef.current.getScrollPosition();
    const isAtScreenEdgeY = deltaY < 0 ? viewport.top > cellsTop : viewport.bottom < cellsBottom;
    const isAtScreenEdgeX = deltaX < 0 ? viewport.left > cellsLeft : viewport.right < cellsRight;
    const pageDeltaY = deltaY !== 0 && isAtScreenEdgeY && position.top === top ? deltaY : 0;
    const pageDeltaX = deltaX !== 0 && isAtScreenEdgeX && position.left === left ? deltaX : 0;
    if (pageDeltaX !== 0 || pageDeltaY !== 0) {
      win.scrollBy(pageDeltaX, pageDeltaY);
    }
  };

  // Runs on every frame of the drag: the cells move under a still pointer while auto-scrolling,
  // and cells that mount during the drag must get the preview classes.
  const onDragFrame = () => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    const root = apiRef.current.rootElementRef?.current;
    const scroller = apiRef.current.virtualScrollerRef?.current;
    // A re-render can null the refs for a frame. Keep the loop alive so the drag resumes.
    if (root && scroller) {
      if (session.canAutoScroll) {
        autoScroll(session, root, scroller);
      }
      updateTargets(session, getElementAtPoint(root, session.clientX, session.clientY));
      session.decoratedElements = decorateFillPreview(
        root,
        session.targets,
        session.decoratedElements,
      );
    }
    session.frame = requestAnimationFrame(onDragFrame);
  };

  const startDrag = (position: PointerDragPosition<null>) => {
    const root = apiRef.current.rootElementRef?.current;
    // The feature can get disabled, or the cell can enter edit mode, during the long press
    if (!root || !isEnabled || !getFillHandleCell(root)) {
      return false;
    }
    const source = createFillSource(apiRef);
    if (!source) {
      return false;
    }
    root.classList.add(gridClasses['root--disableUserSelection']);
    const session: FillDragSession = {
      source,
      targets: { direction: null, targetRowIds: [], targetFields: [] },
      decoratedElements: new Set(),
      startClientX: position.clientX,
      startClientY: position.clientY,
      clientX: position.clientX,
      clientY: position.clientY,
      canAutoScroll: false,
      frame: undefined,
    };
    sessionRef.current = session;
    session.frame = requestAnimationFrame(onDragFrame);
    return true;
  };

  const moveDrag = (position: PointerDragPosition<null>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    if (
      !session.canAutoScroll &&
      hasReachedAutoScrollDistance(
        session.startClientX,
        session.startClientY,
        session.clientX,
        session.clientY,
      )
    ) {
      session.canAutoScroll = true;
    }
  };

  const endDrag = (position: PointerDragPosition<null>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    try {
      updateTargets(session, position.elementAtPoint);
      if (isEnabled) {
        applyFill(apiRef, session.source, session.targets, props);
      }
    } finally {
      // `processRowUpdate` and the listeners of `clipboardPasteStart` can throw: the preview must not stay
      stopSession(session);
    }
  };

  const cancelDrag = () => {
    const session = sessionRef.current;
    if (session) {
      stopSession(session);
    }
  };

  const pointerDrag = usePointerDrag<null>({
    getCaptureElement: () => apiRef.current.rootElementRef?.current,
    touchDelay: FILL_HANDLE_IMMEDIATE_TOUCH_DRAG ? 0 : undefined,
    onDragStart: startDrag,
    onDragMove: moveDrag,
    onDragEnd: endDrag,
    onDragCancel: cancelDrag,
  });

  const handlePointerDown = useEventCallback((event: PointerEvent) => {
    const root = apiRef.current.rootElementRef?.current;
    if (!isPointerDragType(event.pointerType) || !isEnabled || !root) {
      return;
    }
    const cell = getFillHandleCell(root);
    const isRtl = apiRef.current.state.isRtl;
    // A pen is as precise as a mouse: it gets the mouse hit area, which is inside of the cell
    const isOnHandle =
      event.pointerType === 'touch'
        ? isPointerOnFillHandle(cell, event, isRtl, FILL_HANDLE_TOUCH_HIT_AREA) &&
          isFillHandleVisible(root, cell!, isRtl)
        : !!cell?.contains(event.target as Node) && isPointerOnFillHandle(cell, event, isRtl);
    if (isOnHandle) {
      pointerDrag.onPointerDown(event, null);
    }
  });

  useGridRootNativeEventListener(apiRef, 'pointerdown', handlePointerDown);

  const { cancel: cancelPointerDrag } = pointerDrag;
  React.useEffect(() => {
    if (!isEnabled) {
      cancelPointerDrag();
    }
  }, [isEnabled, cancelPointerDrag]);

  React.useEffect(() => {
    return () => {
      // The grid is unmounting: only clean the DOM, without filling
      const session = sessionRef.current;
      if (session) {
        cancelAnimationFrame(session.frame!);
        clearFillPreview(session.decoratedElements);
        sessionRef.current = null;
      }
    };
  }, []);
};
