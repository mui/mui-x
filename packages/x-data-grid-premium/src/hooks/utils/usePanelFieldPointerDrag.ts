'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  createDragPreview,
  getEdgeScrollDelta,
  getElementAtPoint,
  usePointerDrag,
  vars,
} from '@mui/x-data-grid-pro/internals';
import type { DragPreview, PointerDragPosition } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../models/gridApiPremium';

export type PanelFieldDropPosition = 'top' | 'bottom' | null;

export interface PanelFieldDragData<Section> {
  field: string;
  /**
   * The section the field is dragged from.
   */
  section: Section;
}

export interface PanelFieldDropTarget<Section> {
  /**
   * The section of the drop zone under the pointer.
   */
  section: Section;
  /**
   * The field under the pointer. `null` over the rest of the zone, and over the dragged field itself.
   */
  field: string | null;
  /**
   * Whether the pointer is over the top or the bottom half of `field`. `null` without a field.
   */
  position: PanelFieldDropPosition;
}

export interface UsePanelFieldPointerDragOptions<Section> {
  apiRef: RefObject<GridPrivateApiPremium>;
  /**
   * Selector of the drop zones.
   * The `data-section` attribute of a zone is its section. The zone of the available fields has none.
   */
  zoneSelector: string;
  /**
   * Selector of the fields. The `data-field` attribute of a field is its field.
   */
  fieldSelector: string;
  /**
   * Selector of the scrollable containers of the panel.
   * They scroll when the pointer is close to their top or bottom edge.
   */
  scrollAreaSelector: string;
  /**
   * Class added to the drag preview, a copy of the dragged field.
   */
  previewClassName?: string;
  onDragStart: (data: PanelFieldDragData<Section>) => void;
  /**
   * Called when the drop target changes. `null` when the pointer isn't over a zone of the panel.
   * @param {PanelFieldDropTarget<Section> | null} target The new drop target.
   */
  onDropTargetChange: (target: PanelFieldDropTarget<Section> | null) => void;
  /**
   * Called when the field is released over a zone of the panel, before `onDragEnd`.
   * @param {PanelFieldDragData<Section>} data The dragged field.
   * @param {PanelFieldDropTarget<Section>} target The drop target.
   */
  onDrop: (data: PanelFieldDragData<Section>, target: PanelFieldDropTarget<Section>) => void;
  /**
   * Called when the drag ends, with or without a drop.
   */
  onDragEnd: () => void;
}

export interface UsePanelFieldPointerDragReturnValue<Section> {
  /**
   * Ref of the panel element. Only the zones inside it are drop targets.
   */
  panelRef: RefObject<HTMLDivElement | null>;
  /**
   * The `pointerdown` handler of a field.
   * Touch and pen presses start a pointer drag. Mouse presses keep using HTML drag and drop.
   * @param {React.PointerEvent<HTMLElement>} event The `pointerdown` event, with the field as `currentTarget`.
   * @param {PanelFieldDragData<Section>} data The pressed field.
   */
  onPointerDown: (
    event: React.PointerEvent<HTMLElement>,
    data: PanelFieldDragData<Section>,
  ) => void;
}

interface DragData<Section> extends PanelFieldDragData<Section> {
  handle: HTMLElement;
}

interface DragSession<Section> {
  data: PanelFieldDragData<Section>;
  startClientX: number;
  startClientY: number;
  clientX: number;
  clientY: number;
  // Off until the pointer moves away from where the drag started
  canAutoScroll: boolean;
  preview: DragPreview;
  target: PanelFieldDropTarget<Section> | null;
  frame: number | undefined;
}

// Allowlist, not `!== 'mouse'`: an empty or missing `pointerType` must keep HTML drag and drop
const isPointerDragType = (pointerType: string | null | undefined) =>
  pointerType === 'touch' || pointerType === 'pen';

// A slow tap on a control of the field, like its menu button or its aggregation chip, must stay a tap.
const INTERACTIVE_CONTROL_SELECTOR = 'button, a, input, select, textarea, [role="button"]';

// A long press starts the drag in place, maybe inside an edge scroll zone.
// Auto-scroll waits until the pointer moves this far, so picking up a field at an edge doesn't scroll.
const AUTO_SCROLL_ACTIVATION_DISTANCE = 10;

/**
 * Styles of a field root that can be dragged with `usePanelFieldPointerDrag`.
 * @param {string} previewClassName The class of the drag preview, a copy of the field that follows the pointer.
 * @returns {object} Styles to spread in the `styled()` definition of the field root.
 */
export function getPanelFieldPointerDragStyles(previewClassName: string) {
  return {
    // A long press starts a touch drag: it must not select text or open the iOS callout.
    // Only on devices with a touch screen, so the field name stays selectable with a mouse.
    '@media (any-pointer: coarse)': {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTouchCallout: 'none',
    },
    // The field has no background of its own: the preview needs one to stay readable over the list
    [`&.${previewClassName}`]: {
      backgroundColor: vars.colors.background.overlay,
      boxShadow: vars.shadows.overlay,
      opacity: 0.9,
    },
  } as const;
}

function isSameTarget<Section>(
  a: PanelFieldDropTarget<Section> | null,
  b: PanelFieldDropTarget<Section> | null,
) {
  if (a === null || b === null) {
    return a === b;
  }
  return a.section === b.section && a.field === b.field && a.position === b.position;
}

/**
 * Drag and drop of the fields of a side panel, like the pivot panel, with pointer events, for touch and pen input.
 * Mouse input keeps using the HTML drag and drop handlers of the panel, which work on desktop but not on all touch devices.
 * A field can be dropped on a zone, or on another field of a zone, above or below it.
 */
export function usePanelFieldPointerDrag<Section>(
  options: UsePanelFieldPointerDragOptions<Section>,
): UsePanelFieldPointerDragReturnValue<Section> {
  const { apiRef } = options;
  const optionsRef = React.useRef(options);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const sessionRef = React.useRef<DragSession<Section> | null>(null);

  React.useEffect(() => {
    optionsRef.current = options;
  });

  const getDropTarget = (
    session: DragSession<Section>,
    elementAtPoint: Element | null,
  ): PanelFieldDropTarget<Section> | null => {
    const { zoneSelector, fieldSelector } = optionsRef.current;
    const zone = elementAtPoint?.closest(zoneSelector);
    if (!elementAtPoint || !zone || !panelRef.current?.contains(zone)) {
      return null;
    }
    const section = (zone.getAttribute('data-section') ?? null) as Section;
    const fieldElement = elementAtPoint.closest(fieldSelector);
    const field =
      fieldElement && zone.contains(fieldElement) ? fieldElement.getAttribute('data-field') : null;
    if (!fieldElement || field === null || field === session.data.field) {
      return { section, field: null, position: null };
    }
    const rect = fieldElement.getBoundingClientRect();
    const position = session.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
    return { section, field, position };
  };

  const updateTarget = (session: DragSession<Section>, elementAtPoint: Element | null) => {
    const target = getDropTarget(session, elementAtPoint);
    if (isSameTarget(session.target, target)) {
      return;
    }
    session.target = target;
    optionsRef.current.onDropTargetChange(target);
  };

  const stopSession = (session: DragSession<Section>) => {
    cancelAnimationFrame(session.frame!);
    session.preview.remove();
    if (sessionRef.current === session) {
      sessionRef.current = null;
    }
  };

  // Scrolls the container under the pointer when the pointer is close to one of its edges.
  // With pointer capture, the container doesn't scroll on its own.
  const autoScroll = (session: DragSession<Section>, elementAtPoint: Element | null) => {
    const scrollArea = elementAtPoint?.closest<HTMLElement>(optionsRef.current.scrollAreaSelector);
    if (!scrollArea || !panelRef.current?.contains(scrollArea)) {
      return false;
    }
    const rect = scrollArea.getBoundingClientRect();
    const delta = getEdgeScrollDelta(session.clientY, rect.top, rect.bottom);
    if (delta === 0) {
      return false;
    }
    const { scrollTop } = scrollArea;
    scrollArea.scrollTop = scrollTop + delta;
    return scrollArea.scrollTop !== scrollTop;
  };

  // Runs on every frame of the drag, like `dragover` in HTML drag and drop, which keeps firing while the pointer holds still
  const onDragFrame = () => {
    const session = sessionRef.current;
    const root = apiRef.current.rootElementRef?.current;
    if (!session || !root) {
      return;
    }
    let elementAtPoint = getElementAtPoint(root, session.clientX, session.clientY);
    if (session.canAutoScroll && autoScroll(session, elementAtPoint)) {
      // The fields moved under the pointer
      elementAtPoint = getElementAtPoint(root, session.clientX, session.clientY);
    }
    updateTarget(session, elementAtPoint);
    session.frame = requestAnimationFrame(onDragFrame);
  };

  const startDrag = (position: PointerDragPosition<DragData<Section>>) => {
    const root = apiRef.current.rootElementRef?.current;
    if (!root) {
      return false;
    }
    const { handle, ...data } = position.data;
    const session: DragSession<Section> = {
      data,
      startClientX: position.clientX,
      startClientY: position.clientY,
      clientX: position.clientX,
      clientY: position.clientY,
      canAutoScroll: false,
      // Replaces the drag image of HTML drag and drop
      preview: createDragPreview(handle, {
        container: root,
        clientX: position.clientX,
        clientY: position.clientY,
        className: optionsRef.current.previewClassName,
      }),
      target: null,
      frame: undefined,
    };
    sessionRef.current = session;
    optionsRef.current.onDragStart(data);
    updateTarget(session, position.elementAtPoint);
    session.frame = requestAnimationFrame(onDragFrame);
    return true;
  };

  const moveDrag = (position: PointerDragPosition<DragData<Section>>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    if (
      !session.canAutoScroll &&
      Math.hypot(session.clientX - session.startClientX, session.clientY - session.startClientY) >
        AUTO_SCROLL_ACTIVATION_DISTANCE
    ) {
      session.canAutoScroll = true;
    }
    session.preview.move(session.clientX, session.clientY);
    updateTarget(session, position.elementAtPoint);
  };

  const endDrag = (position: PointerDragPosition<DragData<Section>>) => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.clientX = position.clientX;
    session.clientY = position.clientY;
    stopSession(session);
    const target = getDropTarget(session, position.elementAtPoint);
    const { onDrop, onDragEnd } = optionsRef.current;
    try {
      // Like HTML drag and drop, a release outside of the zones does nothing
      if (target) {
        onDrop(session.data, target);
      }
    } finally {
      onDragEnd();
    }
  };

  const cancelDrag = () => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    stopSession(session);
    optionsRef.current.onDragEnd();
  };

  const pointerDrag = usePointerDrag<DragData<Section>>({
    getCaptureElement: () => apiRef.current.rootElementRef?.current,
    onDragStart: startDrag,
    onDragMove: moveDrag,
    onDragEnd: endDrag,
    onDragCancel: cancelDrag,
  });

  const onPointerDown = useEventCallback(
    (event: React.PointerEvent<HTMLElement>, data: PanelFieldDragData<Section>) => {
      if (!isPointerDragType(event.pointerType)) {
        return;
      }
      if ((event.target as Element).closest?.(INTERACTIVE_CONTROL_SELECTOR)) {
        return;
      }
      pointerDrag.onPointerDown(event, { ...data, handle: event.currentTarget });
    },
  );

  // A long press on a draggable element starts a native drag on some browsers (Chrome on Android).
  // It would cancel the pointer events, so it's blocked when the field was pressed with touch or pen.
  // `pointerdown` always comes before `dragstart`, so the pointer type is the one of the last press.
  // Stopping the propagation in the capture phase also keeps the HTML drag and drop handlers from seeing it.
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return undefined;
    }
    // Recorded on the panel, not in `onPointerDown`: a field can skip that handler, for example when it's disabled
    let lastPointerType: string | null = null;
    const handlePointerDown = (event: PointerEvent) => {
      lastPointerType = event.pointerType;
    };
    const handleNativeDragStart = (event: DragEvent) => {
      if (
        isPointerDragType(lastPointerType) &&
        (event.target as Element | null)?.closest?.(optionsRef.current.fieldSelector)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    panel.addEventListener('pointerdown', handlePointerDown, true);
    panel.addEventListener('dragstart', handleNativeDragStart, true);
    return () => {
      panel.removeEventListener('pointerdown', handlePointerDown, true);
      panel.removeEventListener('dragstart', handleNativeDragStart, true);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      // The panel is unmounting: remove the preview without calling the callbacks
      const session = sessionRef.current;
      if (session) {
        cancelAnimationFrame(session.frame!);
        session.preview.remove();
        sessionRef.current = null;
      }
    };
  }, []);

  return { panelRef, onPointerDown };
}
