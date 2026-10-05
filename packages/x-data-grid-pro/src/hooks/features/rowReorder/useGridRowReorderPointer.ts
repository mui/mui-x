'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
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
  getElementAtPoint,
  getGridRowElement,
  gridDimensionsSelector,
  gridEditRowsStateSelector,
  usePointerDrag,
  useGridNativeEventListener,
} from '@mui/x-data-grid/internals';
import type {
  PointerDragPosition,
  RowReorderDragDirection,
  RowReorderDropPosition,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GRID_REORDER_COL_DEF } from './gridRowReorderColDef';
import { findCellElement } from './utils';
import {
  EXPAND_DELAY,
  animateRowMove,
  checkRowReorderValid,
  commitRowReorder,
  evaluateRowDropTarget,
  getAutoScrollDelta,
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
  preview: HTMLElement;
  previewOffsetX: number;
  previewOffsetY: number;
  dropTarget: RowReorderDropTarget | null;
  previousTargetId: GridRowId | null;
  previousDropPosition: RowReorderDropPosition | null;
  dragDirection: RowReorderDragDirection | null;
  pendingExpansion: { rowId: GridRowId; clientX: number; clientY: number } | null;
  autoScrollFrame: number | undefined;
}

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
  // The pointer type of the last press on a row reorder handle
  const handlePointerTypeRef = React.useRef<string | null>(null);

  const isRowDragAllowed = (): boolean =>
    isRowReorderAllowed({
      rowReordering: props.rowReordering,
      sortModel: gridSortModelSelector(apiRef),
      editRowsState: gridEditRowsStateSelector(apiRef),
    });

  const getDraggableHandle = (target: EventTarget | null): HTMLElement | null => {
    const root = apiRef.current.rootElementRef?.current;
    const handle = (target as Element | null)?.closest?.<HTMLElement>(
      `.${gridClasses['rowReorderCell--draggable']}`,
    );
    // Ignore the handles of nested grids, for example in a detail panel
    if (!handle || !root || handle.closest(`.${gridClasses.root}`) !== root) {
      return null;
    }
    return handle;
  };

  const resetDrag = () => {
    expandTimeout.clear();
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    sessionRef.current = null;
    cancelAnimationFrame(session.autoScrollFrame!);
    session.preview.remove();
    const root = apiRef.current.rootElementRef?.current;
    if (root) {
      removeClasses(getGridRowElement(root, session.rowId), classes.rowBeingDragged);
    }
    apiRef.current.setState((state) => ({
      ...state,
      rowReorder: {
        isActive: false,
        draggedRowId: null,
      },
    }));
  };

  const movePreview = (session: RowDragSession) => {
    const root = apiRef.current.rootElementRef?.current;
    if (!root) {
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const x = session.clientX - rootRect.left - session.previewOffsetX;
    const y = session.clientY - rootRect.top - session.previewOffsetY;
    session.preview.style.transform = `translate(${x}px, ${y}px)`;
  };

  // Mirrors the drag over logic of `useGridRowReorder`
  const updateDropTarget = (session: RowDragSession, elementAtPoint: Element | null) => {
    const root = apiRef.current.rootElementRef?.current;
    const rowElement = elementAtPoint?.closest(`.${gridClasses.row}`);
    // Outside of the rows, the last drop target is kept, like with HTML drag and drop
    if (!root || !elementAtPoint || !rowElement || !root.contains(rowElement)) {
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
      const delta = getAutoScrollDelta(
        session.clientY,
        rect.top + dimensions.headersTotalHeight,
        rect.bottom - (dimensions.hasScrollX ? dimensions.scrollbarSize : 0),
      );
      if (delta !== 0) {
        const { top, left } = apiRef.current.getScrollPosition();
        apiRef.current.scroll({ top: top + delta, left });
        // The rows moved under a pointer that may not move
        updateDropTarget(session, getElementAtPoint(root, session.clientX, session.clientY));
      }
    }

    session.autoScrollFrame = requestAnimationFrame(autoScroll);
  };

  const startDrag = (position: PointerDragPosition<DragData>) => {
    const root = apiRef.current.rootElementRef?.current;
    // Reordering can get disabled during the long press.
    // Without a session, the rest of the gesture does nothing.
    if (!root || !isRowDragAllowed()) {
      return;
    }

    const { rowId, handle } = position.data;
    logger.debug(`Start dragging row ${rowId} with a ${position.pointerType} pointer`);

    // The preview replaces the drag image of HTML drag and drop
    const handleRect = handle.getBoundingClientRect();
    const preview = handle.cloneNode(true) as HTMLElement;
    addClasses(preview, classes.rowDragging);
    preview.setAttribute('aria-hidden', 'true');
    Object.assign(preview.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      height: `${handleRect.height}px`,
      margin: '0',
      pointerEvents: 'none',
      zIndex: '100',
    });
    root.appendChild(preview);

    const session: RowDragSession = {
      rowId,
      clientX: position.clientX,
      clientY: position.clientY,
      preview,
      previewOffsetX: position.clientX - handleRect.left,
      previewOffsetY: position.clientY - handleRect.top,
      dropTarget: null,
      previousTargetId: null,
      previousDropPosition: null,
      dragDirection: null,
      pendingExpansion: null,
      autoScrollFrame: undefined,
    };
    sessionRef.current = session;
    movePreview(session);

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
  };

  const moveDrag = (position: PointerDragPosition<DragData>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    movePreview(session);
    updateDropTarget(session, position.elementAtPoint);
  };

  // Mirrors the drag end logic of `useGridRowReorder`
  const endDrag = async (position: PointerDragPosition<DragData>) => {
    const session = sessionRef.current;
    const root = apiRef.current.rootElementRef?.current;
    if (!session || !root) {
      resetDrag();
      return;
    }

    logger.debug('End dragging row with a pointer');
    expandTimeout.clear();
    cancelAnimationFrame(session.autoScrollFrame!);
    session.preview.remove();

    const { rowId, dropTarget, dragDirection } = session;
    if (!position.isInside || !dropTarget || !dragDirection || !isRowDragAllowed()) {
      resetDrag();
      return;
    }

    const isValid = checkRowReorderValid(apiRef, {
      sourceRowId: rowId,
      targetRowId: dropTarget.rowId,
      dropPosition: dropTarget.position,
      dragDirection,
    });
    if (!isValid) {
      resetDrag();
      return;
    }

    try {
      // `resetDrag` clears the reorder state before the event, like `useGridRowReorder`
      await commitRowReorder(
        apiRef,
        rowId,
        dropTarget,
        (move) => animateRowMove(root, move),
        resetDrag,
      );
    } catch {
      // The reorder failed: skip the `rowOrderChange` event.
    }

    resetDrag();
  };

  const pointerDrag = usePointerDrag<DragData>({
    getCaptureElement: () => apiRef.current.rootElementRef?.current,
    onDragStart: startDrag,
    onDragMove: moveDrag,
    onDragEnd: endDrag,
    onDragCancel: resetDrag,
  });

  const handlePointerDown = useEventCallback((event: PointerEvent) => {
    const handle = getDraggableHandle(event.target);
    if (!handle) {
      return;
    }
    handlePointerTypeRef.current = event.pointerType;

    // The mouse keeps using HTML drag and drop
    if (event.pointerType === 'mouse' || !isRowDragAllowed()) {
      return;
    }

    const rowElement = handle.closest(`.${gridClasses.row}`);
    const rowId = rowElement ? getRowIdFromElement(apiRef, rowElement) : null;
    if (rowId === null) {
      return;
    }
    pointerDrag.onPointerDown(event, { rowId, handle });
  });

  // A long press on a draggable element starts a native drag on some browsers (Chrome on Android).
  // It would cancel the pointer events, so it's blocked when the handle was pressed with touch or pen.
  // Stopping the propagation in the capture phase also keeps `useGridRowReorder` from seeing it.
  const handleNativeDragStart = useEventCallback((event: DragEvent) => {
    if (
      handlePointerTypeRef.current !== null &&
      handlePointerTypeRef.current !== 'mouse' &&
      getDraggableHandle(event.target)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.rootElementRef?.current,
    'pointerdown',
    handlePointerDown,
  );

  useGridNativeEventListener(
    apiRef,
    () => apiRef.current.rootElementRef?.current,
    'dragstart',
    handleNativeDragStart,
    { capture: true },
  );

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
