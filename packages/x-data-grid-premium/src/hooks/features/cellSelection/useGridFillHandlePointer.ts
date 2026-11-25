'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
import { gridClasses } from '@mui/x-data-grid-pro';
import {
  autoScrollGridOnPointerDrag,
  FILL_HANDLE_IMMEDIATE_TOUCH_DRAG,
  getElementAtPoint,
  isElementInGrid,
  isPointerDragType,
  useGridRootNativeEventListener,
  usePointerDrag,
} from '@mui/x-data-grid-pro/internals';
import type { PointerDragFrame, PointerDragPosition } from '@mui/x-data-grid-pro/internals';
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
    clearFillPreview(session.decoratedElements);
    apiRef.current.rootElementRef?.current?.classList.remove(
      gridClasses['root--disableUserSelection'],
    );
    if (sessionRef.current === session) {
      sessionRef.current = null;
    }
  };

  // Runs on every frame of the drag: the cells move under a still pointer while auto-scrolling,
  // and cells that mount during the drag must get the preview classes.
  const onDragFrame = (frame: PointerDragFrame<null>) => {
    const session = sessionRef.current;
    const root = apiRef.current.rootElementRef?.current;
    const scroller = apiRef.current.virtualScrollerRef?.current;
    // A re-render can null the refs for a frame. The next frames still run, so the drag resumes.
    if (!session || !root || !scroller) {
      return;
    }
    if (frame.canAutoScroll) {
      autoScrollGridOnPointerDrag(apiRef, scroller, {
        clientX: frame.clientX,
        clientY: frame.clientY,
        axis: 'both',
      });
    }
    updateTargets(session, getElementAtPoint(root, frame.clientX, frame.clientY));
    session.decoratedElements = decorateFillPreview(
      root,
      session.targets,
      session.decoratedElements,
    );
  };

  const startDrag = () => {
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
    };
    sessionRef.current = session;
    return true;
  };

  const endDrag = (position: PointerDragPosition<null>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
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
    onDragEnd: endDrag,
    onDragCancel: cancelDrag,
    onDragFrame,
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
        clearFillPreview(session.decoratedElements);
        sessionRef.current = null;
      }
    };
  }, []);
};
