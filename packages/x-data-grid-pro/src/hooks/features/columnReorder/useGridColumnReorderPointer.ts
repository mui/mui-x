'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import ownerWindow from '@mui/utils/ownerWindow';
import { useRtl } from '@mui/system/RtlProvider';
import { gridClasses, useGridLogger } from '@mui/x-data-grid';
import type { CursorCoordinates } from '@mui/x-data-grid';
import {
  createDragPreview,
  getEdgeScrollDelta,
  getElementAtPoint,
  getVisibleViewportBounds,
  gridDimensionsSelector,
  hasReachedAutoScrollDistance,
  usePointerDrag,
} from '@mui/x-data-grid/internals';
import type { DragPreview, PointerDragPosition } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { isElementInGrid, useGridPointerDragRouting } from '../../utils/useGridPointerDragRouting';
import { gridColumnReorderDragColSelector } from './columnReorderSelector';
import { useUtilityClasses } from './useGridColumnReorder';
import {
  finishColumnReorder,
  getColumnReorderTargetIndex,
  hasCursorPositionChanged,
  setColumnReorderDragCol,
  startColumnReorder,
} from './columnReorderUtils';
import type { ColumnReorderForbiddenIndexes } from './columnReorderUtils';

interface DragData {
  field: string;
  handle: HTMLElement;
}

interface ColumnDragSession {
  field: string;
  originIndex: number;
  forbiddenIndexes: ColumnReorderForbiddenIndexes;
  startClientX: number;
  startClientY: number;
  clientX: number;
  clientY: number;
  // Off until the pointer moves away from where the drag started
  canAutoScroll: boolean;
  // The pointer position of the last column evaluation, like `cursorPosition` in `useGridColumnReorder`
  previousPosition: CursorCoordinates;
  preview: DragPreview;
  frame: number | undefined;
}

// The scroll areas of HTML drag and drop show while a column is dragged.
// They cover the edges of the headers, so hit-testing skips them.
const HIT_TEST_IGNORE_SELECTOR = `.${gridClasses.scrollArea}`;

// Headers and cells, the drop targets of HTML drag and drop. Column group headers have `data-fields`.
// Other elements in the root carry `data-field` too, like the pivot panel chips, hence the classes.
const TARGET_SELECTOR = `.${gridClasses.columnHeader}[data-field], .${gridClasses.cell}[data-field]`;

// While the grid auto-scrolls, the pointer can be past the edge of the scrollable columns: over a pinned
// column, which can't be a target, or outside the grid. The columns are then evaluated at the edge instead,
// this far inside it: the resize separator of a pinned column overhangs the scrollable columns by 5px
// (`columnSeparatorOffset`) and resolves to the pinned header.
const EDGE_HIT_TEST_INSET = 12;

// A slow tap on the sort or menu button must stay a tap, not start a drag.
// Only native controls; a custom header control as `div[role="button"]` isn't covered.
const INTERACTIVE_CONTROL_SELECTOR = 'button, a, input, select, textarea';

/**
 * Column reordering with pointer events, for touch and pen input.
 * Mouse input keeps using the HTML drag and drop of `useGridColumnReorder`, which works on desktop but not on all touch devices.
 * @requires useGridColumns (method)
 * @requires useGridColumnReorder (state)
 */
export const useGridColumnReorderPointer = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'disableColumnReorder' | 'keepColumnPositionIfDraggedOutside' | 'classes'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnReorderPointer');
  const classes = useUtilityClasses({ classes: props.classes });
  const isRtl = useRtl();
  const sessionRef = React.useRef<ColumnDragSession | null>(null);

  const canReorderColumn = (field: string): boolean => {
    if (props.disableColumnReorder) {
      return false;
    }
    const column = apiRef.current.getColumn(field);
    return !!column && !column.disableReorder;
  };

  // The field of the header or cell under the pointer, when it belongs to this grid.
  // The headers and cells of a nested grid, for example in a detail panel, can't be targets.
  const getTargetField = (elementAtPoint: Element | null): string | null => {
    const root = apiRef.current.rootElementRef?.current;
    const target = elementAtPoint?.closest(TARGET_SELECTOR);
    if (!target || !isElementInGrid(root, target)) {
      return null;
    }
    return target.getAttribute('data-field');
  };

  // Removes what the session added to the DOM. The reorder state is handled by the caller.
  const stopSession = (session: ColumnDragSession) => {
    cancelAnimationFrame(session.frame!);
    session.preview.remove();
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
    if (sessionRef.current === session) {
      sessionRef.current = null;
    }
  };

  // Mirrors the drag end logic of `useGridColumnReorder`
  const finishDrag = (session: ColumnDragSession, restoreOrigin: boolean) => {
    if (props.disableColumnReorder) {
      // The reorder got disabled during the drag: the column stays where it is, without an event,
      // but the state must not stay set because the scroll areas derive their visibility from it.
      setColumnReorderDragCol(apiRef, '');
      return;
    }
    try {
      // Publishes `columnOrderChange` synchronously: an error of a listener must reach the user
      finishColumnReorder(apiRef, {
        dragField: session.field,
        originIndex: session.originIndex,
        restoreOrigin,
      });
    } finally {
      // The event is published before the state is cleared: a listener that throws must not leave the drag active
      if (gridColumnReorderDragColSelector(apiRef)) {
        setColumnReorderDragCol(apiRef, '');
      }
    }
  };

  // Mirrors the drag over logic of `useGridColumnReorder`
  const updateTarget = (session: ColumnDragSession, elementAtPoint: Element | null) => {
    const targetField = getTargetField(elementAtPoint);
    // Outside of the headers and cells, nothing moves, like with HTML drag and drop
    if (targetField === null) {
      return;
    }
    const position = { x: session.clientX, y: session.clientY };
    if (
      targetField === session.field ||
      !hasCursorPositionChanged(session.previousPosition, position) ||
      !apiRef.current.getColumn(targetField)
    ) {
      return;
    }

    const targetIndex = getColumnReorderTargetIndex(apiRef, {
      dragField: session.field,
      targetField,
      previousPosition: session.previousPosition,
      position,
      isRtl,
      forbiddenIndexes: session.forbiddenIndexes,
    });
    if (targetIndex !== null) {
      apiRef.current.setColumnIndex(session.field, targetIndex);
    }
    session.previousPosition = position;
  };

  // The edges of the scrollable columns, between the pinned columns, in client coordinates.
  // In RTL, the left pinned columns are on the right side and the vertical scrollbar on the left.
  const getScrollableColumnsBounds = (scrollerRect: DOMRect) => {
    const dimensions = gridDimensionsSelector(apiRef);
    const scrollbarSize = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
    const startInset = isRtl
      ? dimensions.rightPinnedWidth + scrollbarSize
      : dimensions.leftPinnedWidth;
    const endInset = isRtl
      ? dimensions.leftPinnedWidth
      : dimensions.rightPinnedWidth + scrollbarSize;
    return { left: scrollerRect.left + startInset, right: scrollerRect.right - endInset };
  };

  // Returns the scroll delta that was applied, `0` when nothing scrolled
  const autoScroll = (
    session: ColumnDragSession,
    root: HTMLElement,
    scroller: HTMLElement,
  ): number => {
    const rect = scroller.getBoundingClientRect();
    if (session.clientY < rect.top || session.clientY > rect.bottom) {
      return 0;
    }

    const { left: columnsLeft, right: columnsRight } = getScrollableColumnsBounds(rect);
    // The page doesn't scroll during a touch drag, so a zone off-screen couldn't be reached
    const win = ownerWindow(root);
    const viewport = getVisibleViewportBounds(win);
    const delta = getEdgeScrollDelta(
      session.clientX,
      Math.max(columnsLeft, viewport.left),
      Math.min(columnsRight, viewport.right),
    );
    if (delta === 0) {
      return 0;
    }

    const { left } = apiRef.current.getScrollPosition();
    // `scroll` takes the distance from the start edge and flips it in RTL, where `scrollLeft` is negative
    apiRef.current.scroll({ left: (isRtl ? -1 : 1) * (left + delta) });
    if (apiRef.current.getScrollPosition().left !== left) {
      return delta;
    }
    // The grid can't scroll further: scroll the page when the pointer is at the edge of the screen
    const isAtScreenEdge = delta < 0 ? viewport.left > columnsLeft : viewport.right < columnsRight;
    if (isAtScreenEdge) {
      win.scrollBy(delta, 0);
      return delta;
    }
    return 0;
  };

  // Runs on every frame of the drag, so the auto-scroll goes on while the pointer holds still
  const onDragFrame = () => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    const root = apiRef.current.rootElementRef?.current;
    const scroller = apiRef.current.virtualScrollerRef?.current;
    // A re-render can null the refs for a frame. Keep the loop alive so auto-scroll resumes.
    if (session.canAutoScroll && root && scroller) {
      const delta = autoScroll(session, root, scroller);
      if (delta !== 0) {
        // The root moves with the page scroll, and the preview is positioned in it
        session.preview.move(session.clientX, session.clientY);
        // The columns moved under the still pointer: evaluate them as if it had moved toward the edge
        session.previousPosition = { x: session.clientX - Math.sign(delta), y: session.clientY };
        // Past the edge, there's no target under the pointer: evaluate the column at the edge instead,
        // so the dragged column keeps following the scroll up to the pinned columns
        const bounds = getScrollableColumnsBounds(scroller.getBoundingClientRect());
        const hitX = Math.min(
          Math.max(session.clientX, bounds.left + EDGE_HIT_TEST_INSET),
          bounds.right - EDGE_HIT_TEST_INSET,
        );
        updateTarget(
          session,
          getElementAtPoint(root, hitX, session.clientY, HIT_TEST_IGNORE_SELECTOR),
        );
      }
    }
    session.frame = requestAnimationFrame(onDragFrame);
  };

  const startDrag = (position: PointerDragPosition<DragData>) => {
    const root = apiRef.current.rootElementRef?.current;
    const { field, handle } = position.data;
    // Reordering can get disabled, and the header re-rendered elsewhere, during the long press
    if (!root || !handle.isConnected || !canReorderColumn(field)) {
      return false;
    }

    logger.debug(`Start dragging col ${field} with a ${position.pointerType} pointer`);
    // Replaces the drag image of HTML drag and drop
    const preview = createDragPreview(handle, {
      container: root,
      clientX: position.clientX,
      clientY: position.clientY,
      className: classes.columnHeaderDragging,
    });
    // Only the pressed header is unselectable: the finger would select the text it moves over
    root.classList.add(gridClasses['root--disableUserSelection']);
    const { originIndex, forbiddenIndexes } = startColumnReorder(apiRef, field);
    const session: ColumnDragSession = {
      field,
      originIndex,
      forbiddenIndexes,
      startClientX: position.clientX,
      startClientY: position.clientY,
      clientX: position.clientX,
      clientY: position.clientY,
      canAutoScroll: false,
      previousPosition: { x: position.clientX, y: position.clientY },
      preview,
      frame: undefined,
    };
    sessionRef.current = session;
    session.frame = requestAnimationFrame(onDragFrame);
    return true;
  };

  const moveDrag = (position: PointerDragPosition<DragData>) => {
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
    session.preview.move(session.clientX, session.clientY);
    updateTarget(session, position.elementAtPoint);
  };

  const endDrag = (position: PointerDragPosition<DragData>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    logger.debug('End dragging col with a pointer');
    stopSession(session);
    // Unlike HTML drag and drop, a release anywhere in the grid is a drop: the finger hides the
    // header it releases on, and snapping the column back from the group headers feels broken.
    const root = apiRef.current.rootElementRef?.current;
    const isInsideGrid =
      !!root && !!position.elementAtPoint && root.contains(position.elementAtPoint);
    finishDrag(session, !isInsideGrid && !props.keepColumnPositionIfDraggedOutside);
  };

  // `Escape`, `pointercancel` and lost pointer capture end the drag like a release outside the grid
  const cancelDrag = () => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    logger.debug('Cancel dragging col with a pointer');
    stopSession(session);
    finishDrag(session, !props.keepColumnPositionIfDraggedOutside);
  };

  const pointerDrag = usePointerDrag<DragData>({
    getCaptureElement: () => apiRef.current.rootElementRef?.current,
    onDragStart: startDrag,
    onDragMove: moveDrag,
    onDragEnd: endDrag,
    onDragCancel: cancelDrag,
    hitTestIgnoreSelector: HIT_TEST_IGNORE_SELECTOR,
  });

  useGridPointerDragRouting(apiRef, {
    // `draggable` is `true` only when the column can be reordered, so those rules aren't repeated here
    handleSelector: `.${gridClasses.columnHeaderDraggableContainer}[draggable="true"]`,
    onPointerDown: (event, handle) => {
      const control = (event.target as Element | null)?.closest?.(INTERACTIVE_CONTROL_SELECTOR);
      if (control && handle.contains(control)) {
        return;
      }
      const field = getTargetField(handle);
      if (field !== null && canReorderColumn(field)) {
        pointerDrag.onPointerDown(event, { field, handle });
      }
    },
  });

  React.useEffect(() => {
    return () => {
      // The grid is unmounting: remove the preview without updating the state.
      // The root goes with it, so its selection class doesn't need to be removed.
      const session = sessionRef.current;
      if (session) {
        cancelAnimationFrame(session.frame!);
        session.preview.remove();
        sessionRef.current = null;
      }
    };
  }, []);
};
