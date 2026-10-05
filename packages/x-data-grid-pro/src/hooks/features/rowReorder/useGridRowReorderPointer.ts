'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useTimeout from '@mui/utils/useTimeout';
import composeClasses from '@mui/utils/composeClasses';
import {
  getDataGridUtilityClass,
  gridClasses,
  gridRowNodeSelector,
  gridSortModelSelector,
  useGridLogger,
} from '@mui/x-data-grid';
import type { GridRowId } from '@mui/x-data-grid';
import {
  createDragPreview,
  getEdgeScrollDelta,
  getElementAtPoint,
  getGridRowElement,
  gridDimensionsSelector,
  gridEditRowsStateSelector,
  usePointerDrag,
} from '@mui/x-data-grid/internals';
import type {
  DragPreview,
  PointerDragPosition,
  RowReorderDragDirection,
  RowReorderDropPosition,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { isElementInGrid, useGridPointerDragRouting } from '../../utils/useGridPointerDragRouting';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
import { findCellElement } from './utils';
import {
  EXPAND_DELAY,
  animateRowMove,
  checkRowReorderValid,
  commitRowReorder,
  evaluateRowDropTarget,
  getRowDropPosition,
  getRowIdFromElement,
  hasLeftPendingExpansion,
  isRowReorderAllowed,
  setRowReorderDropTarget,
  shouldExpandGroupOnHover,
  toggleHoveredGroupExpansion,
} from './rowReorderDragUtils';
import type { RowReorderDropTarget } from './rowReorderDragUtils';

type OwnerState = { classes: DataGridProProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    rowDragging: ['row--dragging'],
    rowBeingDragged: ['row--beingDragged'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface DragData {
  rowId: GridRowId;
  handle: HTMLElement;
}

interface RowDragSession {
  rowId: GridRowId;
  clientX: number;
  clientY: number;
  preview: DragPreview;
  dropTarget: RowReorderDropTarget | null;
  previousTargetId: GridRowId | null;
  previousDropPosition: RowReorderDropPosition | null;
  dragDirection: RowReorderDragDirection | null;
  pendingExpansion: { rowId: GridRowId; clientX: number; clientY: number } | null;
  autoScrollFrame: number | undefined;
}

// The scroll areas of HTML drag and drop show while a row is dragged.
// They cover the edges of the rows, so hit-testing skips them.
const HIT_TEST_IGNORE_SELECTOR = `.${gridClasses.scrollArea}`;

const addClasses = (element: Element | null, className: string) => {
  // `composeClasses` returns the default class and the custom ones, separated by spaces
  element?.classList.add(...className.split(' ').filter(Boolean));
};

const removeClasses = (element: Element | null, className: string) => {
  element?.classList.remove(...className.split(' ').filter(Boolean));
};

/**
 * Row reordering with pointer events, for touch and pen input.
 * Mouse input keeps using the HTML drag and drop of `useGridRowReorder`, which works on desktop but not on all touch devices.
 * @requires useGridRowReorder (pipe processor `isRowReorderValid`)
 */
export const useGridRowReorderPointer = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'rowReordering' | 'treeData' | 'classes'>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridRowReorderPointer');
  const classes = useUtilityClasses({ classes: props.classes });
  const expandTimeout = useTimeout();
  const sessionRef = React.useRef<RowDragSession | null>(null);

  const isRowReorderAllowedNow = (): boolean =>
    isRowReorderAllowed({
      rowReordering: props.rowReordering,
      sortModel: gridSortModelSelector(apiRef),
      editRowsState: gridEditRowsStateSelector(apiRef),
    });

  // A session can end while its drop is still committing, and a newer drag can start meanwhile.
  // Only the current session resets the shared reorder state; an older one only reverts its own DOM changes.
  const resetDrag = (session: RowDragSession | null = sessionRef.current) => {
    if (!session) {
      expandTimeout.clear();
      return;
    }
    cancelAnimationFrame(session.autoScrollFrame!);
    session.preview.remove();
    const isCurrent = sessionRef.current === session;
    const root = apiRef.current.rootElementRef?.current;
    if (root && (isCurrent || sessionRef.current?.rowId !== session.rowId)) {
      removeClasses(getGridRowElement(root, session.rowId), classes.rowBeingDragged);
    }
    if (!isCurrent) {
      return;
    }
    sessionRef.current = null;
    expandTimeout.clear();
    apiRef.current.setState((state) => ({
      ...state,
      rowReorder: {
        isActive: false,
        draggedRowId: null,
      },
    }));
  };

  // Mirrors the drag over logic of `useGridRowReorder`
  const updateDropTarget = (session: RowDragSession, elementAtPoint: Element | null) => {
    const root = apiRef.current.rootElementRef?.current;
    const rowElement = elementAtPoint?.closest(`.${gridClasses.row}`);
    // Outside of the rows, the last drop target is kept, like with HTML drag and drop.
    // The rows of a nested grid, for example in a detail panel, aren't drop targets.
    if (!elementAtPoint || !rowElement || !isElementInGrid(root, rowElement)) {
      return;
    }
    const targetId = getRowIdFromElement(apiRef, rowElement);
    if (targetId === null) {
      return;
    }
    const targetNode = gridRowNodeSelector(apiRef, targetId);
    const sourceNode = gridRowNodeSelector(apiRef, session.rowId);
    if (
      !sourceNode ||
      !targetNode ||
      targetNode.type === 'footer' ||
      targetNode.type === 'pinnedRow'
    ) {
      return;
    }

    const { clientX, clientY } = session;
    const pending = session.pendingExpansion;
    // Avoid expanding a group when the pointer is only passing over it
    if (pending && hasLeftPendingExpansion(pending, targetId, clientX, clientY)) {
      expandTimeout.clear();
      session.pendingExpansion = null;
    }

    // For tree data, the cell is measured to avoid flickering in the top 20% zone
    const dropPosition = getRowDropPosition(
      props.treeData ? findCellElement(elementAtPoint) : rowElement,
      clientY,
      !!props.treeData,
    );

    if (
      !session.pendingExpansion &&
      shouldExpandGroupOnHover(sourceNode, targetNode, dropPosition)
    ) {
      expandTimeout.start(EXPAND_DELAY, () => toggleHoveredGroupExpansion(apiRef, targetId));
      session.pendingExpansion = { rowId: targetId, clientX, clientY };
      return;
    }

    if (session.previousTargetId === targetId && session.previousDropPosition === dropPosition) {
      return;
    }

    const { dragDirection, showIndicator } = evaluateRowDropTarget(
      apiRef,
      session.rowId,
      targetId,
      dropPosition,
    );

    session.previousTargetId = targetId;
    session.previousDropPosition = dropPosition;
    session.dragDirection = dragDirection;

    session.dropTarget = showIndicator ? { rowId: targetId, position: dropPosition } : null;
    setRowReorderDropTarget(apiRef, session.dropTarget ?? undefined);
  };

  const autoScroll = () => {
    const session = sessionRef.current;
    const root = apiRef.current.rootElementRef?.current;
    const scroller = apiRef.current.virtualScrollerRef?.current;
    if (!session || !root || !scroller) {
      return;
    }

    const rect = scroller.getBoundingClientRect();
    if (session.clientX >= rect.left && session.clientX <= rect.right) {
      const dimensions = gridDimensionsSelector(apiRef);
      const delta = getEdgeScrollDelta(
        session.clientY,
        rect.top + dimensions.headersTotalHeight,
        rect.bottom - (dimensions.hasScrollX ? dimensions.scrollbarSize : 0),
      );
      if (delta !== 0) {
        const { top, left } = apiRef.current.getScrollPosition();
        apiRef.current.scroll({ top: top + delta, left });
        // The rows moved under a pointer that may not move
        updateDropTarget(
          session,
          getElementAtPoint(root, session.clientX, session.clientY, HIT_TEST_IGNORE_SELECTOR),
        );
      }
    }

    session.autoScrollFrame = requestAnimationFrame(autoScroll);
  };

  const startDrag = (position: PointerDragPosition<DragData>) => {
    const root = apiRef.current.rootElementRef?.current;
    // Reordering can get disabled during the long press
    if (!root || !isRowReorderAllowedNow()) {
      return false;
    }

    const { rowId, handle } = position.data;
    logger.debug(`Start dragging row ${rowId} with a ${position.pointerType} pointer`);

    const session: RowDragSession = {
      rowId,
      clientX: position.clientX,
      clientY: position.clientY,
      // Replaces the drag image of HTML drag and drop
      preview: createDragPreview(handle, {
        container: root,
        clientX: position.clientX,
        clientY: position.clientY,
        className: classes.rowDragging,
      }),
      dropTarget: null,
      previousTargetId: null,
      previousDropPosition: null,
      dragDirection: null,
      pendingExpansion: null,
      autoScrollFrame: undefined,
    };
    sessionRef.current = session;

    apiRef.current.setState((state) => ({
      ...state,
      rowReorder: {
        ...state.rowReorder,
        isActive: true,
        draggedRowId: rowId,
      },
    }));
    addClasses(getGridRowElement(root, rowId), classes.rowBeingDragged);
    apiRef.current.setCellFocus(rowId, GRID_REORDER_COL_DEF.field);

    updateDropTarget(session, position.elementAtPoint);
    session.autoScrollFrame = requestAnimationFrame(autoScroll);
    return true;
  };

  const moveDrag = (position: PointerDragPosition<DragData>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    session.preview.move(session.clientX, session.clientY);
    updateDropTarget(session, position.elementAtPoint);
  };

  // Mirrors the drag end logic of `useGridRowReorder`
  const endDrag = async (position: PointerDragPosition<DragData>) => {
    const session = sessionRef.current;
    const root = apiRef.current.rootElementRef?.current;
    if (!session || !root) {
      resetDrag(session);
      return;
    }

    logger.debug('End dragging row with a pointer');
    expandTimeout.clear();
    cancelAnimationFrame(session.autoScrollFrame!);
    session.preview.remove();

    const { rowId, dropTarget, dragDirection } = session;
    if (!position.isInside || !dropTarget || !dragDirection || !isRowReorderAllowedNow()) {
      resetDrag(session);
      return;
    }

    const isValid = checkRowReorderValid(apiRef, {
      sourceRowId: rowId,
      targetRowId: dropTarget.rowId,
      dropPosition: dropTarget.position,
      dragDirection,
    });
    if (!isValid) {
      resetDrag(session);
      return;
    }

    try {
      // The reorder state is cleared before the event, like in `useGridRowReorder`
      await commitRowReorder(
        apiRef,
        rowId,
        dropTarget,
        (move) => animateRowMove(root, move),
        () => resetDrag(session),
      );
    } catch {
      // The reorder failed: skip the `rowOrderChange` event.
    }

    resetDrag(session);
  };

  const pointerDrag = usePointerDrag<DragData>({
    getCaptureElement: () => apiRef.current.rootElementRef?.current,
    onDragStart: startDrag,
    onDragMove: moveDrag,
    onDragEnd: endDrag,
    onDragCancel: () => resetDrag(),
    hitTestIgnoreSelector: HIT_TEST_IGNORE_SELECTOR,
  });

  useGridPointerDragRouting(apiRef, {
    handleSelector: `.${gridClasses['rowReorderCell--draggable']}`,
    onPointerDown: (event, handle) => {
      if (!isRowReorderAllowedNow()) {
        return;
      }
      const rowElement = handle.closest(`.${gridClasses.row}`);
      const rowId = rowElement ? getRowIdFromElement(apiRef, rowElement) : null;
      if (rowId !== null) {
        pointerDrag.onPointerDown(event, { rowId, handle });
      }
    },
  });

  React.useEffect(() => {
    return () => {
      // The grid is unmounting: remove the preview without updating the state
      const session = sessionRef.current;
      if (session) {
        cancelAnimationFrame(session.autoScrollFrame!);
        session.preview.remove();
        sessionRef.current = null;
      }
    };
  }, []);
};
