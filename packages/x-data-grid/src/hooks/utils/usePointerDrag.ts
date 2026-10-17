'use client';
import * as React from 'react';
import ownerDocument from '@mui/utils/ownerDocument';

// This hook must not depend on the Data Grid, so it can be moved to `@mui/x-internals`
// and reused by other components (for example, the Tree View).

export interface PointerDragPosition<TData> {
  /**
   * The data passed to `onPointerDown` when the drag session started.
   */
  data: TData;
  /**
   * The pointer type of the drag session: `'mouse'`, `'pen'` or `'touch'`.
   */
  pointerType: string;
  clientX: number;
  clientY: number;
  /**
   * The topmost element at the pointer position.
   * With pointer capture, the event target is always the capture element, so drop targets must be found with this.
   * Elements with `pointer-events: none`, like a drag preview, and elements matching `hitTestIgnoreSelector` are ignored.
   */
  elementAtPoint: Element | null;
  /**
   * Whether the pointer is within the bounds of the capture element.
   */
  isInside: boolean;
}

export interface UsePointerDragOptions<TData> {
  /**
   * Returns the element that captures the pointer during a drag.
   * It must stay mounted during the whole drag session, so the handle that started it must not be used.
   * Virtualization can unmount the handle while it's being dragged.
   * @returns {HTMLElement | null | undefined} The capture element.
   */
  getCaptureElement: () => HTMLElement | null | undefined;
  /**
   * Time in ms a touch pointer must be held still before the drag starts.
   * Moving earlier cancels the drag and lets the browser scroll instead.
   * @default 300
   */
  touchDelay?: number;
  /**
   * Distance in px a touch pointer can move during `touchDelay` without canceling the drag.
   * @default 8
   */
  touchTolerance?: number;
  /**
   * Distance in px a mouse or pen pointer must move before the drag starts.
   * @default 5
   */
  mouseDistance?: number;
  /**
   * Selector of elements to skip when finding `elementAtPoint`, with their descendants.
   * For overlays that must keep receiving events from other inputs, so they can't use `pointer-events: none`.
   */
  hitTestIgnoreSelector?: string;
  /**
   * Called when the activation constraints are met.
   * @param {PointerDragPosition<TData>} position The pointer position.
   * @returns {boolean | void} `false` to refuse the drag, for example when it isn't allowed anymore.
   * The session ends without `onDragCancel`, and the pointer is released.
   */
  onDragStart?: (position: PointerDragPosition<TData>) => boolean | void;
  onDragMove?: (position: PointerDragPosition<TData>) => void;
  onDragEnd?: (position: PointerDragPosition<TData>) => void;
  /**
   * Called when a started drag stops without a drop: `Escape`, `pointercancel`, lost pointer capture, or `cancel()`.
   * @param {TData} data The data of the drag session.
   */
  onDragCancel?: (data: TData) => void;
}

export interface UsePointerDragReturnValue<TData> {
  /**
   * Starts a pending drag session. The drag starts once the activation constraints are met.
   * Ignored while another session is pending or active.
   * @param {PointerEvent | React.PointerEvent} event The `pointerdown` event on the drag handle.
   * @param {TData} data The data passed to the drag callbacks, for example the id of the dragged item.
   */
  onPointerDown: (event: PointerEvent | React.PointerEvent, data: TData) => void;
  /**
   * Stops the current session. Calls `onDragCancel` if the drag had started.
   */
  cancel: () => void;
}

interface DragSession<TData> {
  status: 'pending' | 'dragging';
  data: TData;
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  clientX: number;
  clientY: number;
  captureElement: HTMLElement | null;
  doc: Document;
  timeout: ReturnType<typeof setTimeout> | undefined;
  cleanup: () => void;
}

const DEFAULT_TOUCH_DELAY = 300;
const DEFAULT_TOUCH_TOLERANCE = 8;
const DEFAULT_MOUSE_DISTANCE = 5;
// The `click` usually follows the `pointerup` in the same task, but it can come later, for example
// the compatibility click of a touch. Matches the click prevention after a column resize.
const SUPPRESS_CLICK_TIMEOUT = 100;

/**
 * Returns the topmost element at the given viewport position, in the document or shadow root of `element`.
 * @param {HTMLElement | null} element An element of the document or shadow root to hit-test.
 * @param {number} x The horizontal viewport position.
 * @param {number} y The vertical viewport position.
 * @param {string} ignoreSelector Selector of elements to skip, with their descendants.
 * @returns {Element | null} The element at the position, or `null` when hit-testing isn't supported.
 */
export function getElementAtPoint(
  element: HTMLElement | null,
  x: number,
  y: number,
  ignoreSelector?: string,
): Element | null {
  if (!element) {
    return null;
  }
  const root = element.getRootNode();
  // `ShadowRoot` has its own `elementFromPoint`, which returns elements inside the shadow tree
  const hitTestRoot: DocumentOrShadowRoot =
    typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot ? root : ownerDocument(element);
  // Not implemented in jsdom, where apps using the grid often run their tests
  if (typeof hitTestRoot.elementFromPoint !== 'function') {
    return null;
  }
  if (!ignoreSelector) {
    return hitTestRoot.elementFromPoint(x, y);
  }
  // Ordered from the topmost element down
  const elements = hitTestRoot.elementsFromPoint(x, y);
  return elements.find((candidate) => !candidate.closest(ignoreSelector)) ?? null;
}

function isPointInside(element: HTMLElement | null, x: number, y: number) {
  if (!element) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/**
 * Drag and drop based on Pointer Events, which works with mouse, pen and touch input.
 * The HTML drag and drop API doesn't work reliably on touch screens.
 */
export function usePointerDrag<TData>(
  options: UsePointerDragOptions<TData>,
): UsePointerDragReturnValue<TData> {
  const optionsRef = React.useRef(options);
  const sessionRef = React.useRef<DragSession<TData> | null>(null);

  React.useEffect(() => {
    optionsRef.current = options;
  });

  const getPosition = React.useCallback(
    (session: DragSession<TData>): PointerDragPosition<TData> => {
      const captureElement = session.captureElement;
      return {
        data: session.data,
        pointerType: session.pointerType,
        clientX: session.clientX,
        clientY: session.clientY,
        elementAtPoint: getElementAtPoint(
          captureElement,
          session.clientX,
          session.clientY,
          optionsRef.current.hitTestIgnoreSelector,
        ),
        isInside: isPointInside(captureElement, session.clientX, session.clientY),
      };
    },
    [],
  );

  const endSession = React.useCallback((session: DragSession<TData>) => {
    clearTimeout(session.timeout);
    session.cleanup();
    if (session.captureElement?.hasPointerCapture?.(session.pointerId)) {
      session.captureElement.releasePointerCapture(session.pointerId);
    }
    if (sessionRef.current === session) {
      sessionRef.current = null;
    }
  }, []);

  // Ends a started drag without a drop
  const abortDrag = React.useCallback(
    (session: DragSession<TData>) => {
      endSession(session);
      // A mouse or pen button can still be pressed, and its release must not click either.
      // A touch ends without a click once it moved.
      if (session.pointerType !== 'touch') {
        suppressClickAfterRelease(session.doc, session.pointerId);
      }
    },
    [endSession],
  );

  const cancel = React.useCallback(() => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    if (session.status !== 'dragging') {
      endSession(session);
      return;
    }
    abortDrag(session);
    optionsRef.current.onDragCancel?.(session.data);
  }, [abortDrag, endSession]);

  const onPointerDown = React.useCallback(
    (event: PointerEvent | React.PointerEvent, data: TData) => {
      if (sessionRef.current || !event.isPrimary || event.button !== 0) {
        return;
      }

      const captureElement = optionsRef.current.getCaptureElement() ?? null;
      const doc = ownerDocument(captureElement ?? (event.currentTarget as Element | null));

      const session: DragSession<TData> = {
        status: 'pending',
        data,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startX: event.clientX,
        startY: event.clientY,
        clientX: event.clientX,
        clientY: event.clientY,
        captureElement,
        doc,
        timeout: undefined,
        cleanup: () => {},
      };

      const startDragging = () => {
        session.status = 'dragging';
        // Capture only once the drag starts. With an earlier capture, a click without a drag
        // would target the capture element instead of the handle, so for example a click on
        // a column header would stop sorting the column.
        try {
          captureElement?.setPointerCapture(session.pointerId);
        } catch {
          // The pointer can already be released, or not be an active pointer at all (synthetic events).
          // The document listeners still receive the events in that case.
        }
        if (optionsRef.current.onDragStart?.(getPosition(session)) === false) {
          abortDrag(session);
        }
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== session.pointerId) {
          return;
        }
        session.clientX = moveEvent.clientX;
        session.clientY = moveEvent.clientY;

        if (session.status === 'dragging') {
          optionsRef.current.onDragMove?.(getPosition(session));
          return;
        }

        // The button was released outside the window, where no `pointerup` reaches the document.
        if (moveEvent.pointerType !== 'touch' && moveEvent.buttons === 0) {
          endSession(session);
          return;
        }

        const distance = Math.hypot(
          session.clientX - session.startX,
          session.clientY - session.startY,
        );
        if (session.pointerType === 'touch') {
          // The user is scrolling, not dragging.
          if (distance > (optionsRef.current.touchTolerance ?? DEFAULT_TOUCH_TOLERANCE)) {
            endSession(session);
          }
        } else if (distance >= (optionsRef.current.mouseDistance ?? DEFAULT_MOUSE_DISTANCE)) {
          startDragging();
          // `onDragStart` can refuse or cancel the drag
          if (sessionRef.current === session) {
            optionsRef.current.onDragMove?.(getPosition(session));
          }
        }
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== session.pointerId) {
          return;
        }
        session.clientX = upEvent.clientX;
        session.clientY = upEvent.clientY;
        const wasDragging = session.status === 'dragging';
        const position = getPosition(session);
        endSession(session);
        if (wasDragging) {
          suppressNextClick(doc);
          optionsRef.current.onDragEnd?.(position);
        }
      };

      const handlePointerCancel = (cancelEvent: PointerEvent) => {
        if (cancelEvent.pointerId === session.pointerId) {
          cancel();
        }
      };

      const handleLostPointerCapture = (lostEvent: PointerEvent) => {
        // Touch pointers are implicitly captured by the handle, which loses that capture when
        // the capture element takes it over. Only a loss from the capture element ends the drag.
        if (
          lostEvent.pointerId === session.pointerId &&
          session.status === 'dragging' &&
          lostEvent.target === session.captureElement
        ) {
          cancel();
        }
      };

      const handleKeyDown = (keyEvent: KeyboardEvent) => {
        if (keyEvent.key === 'Escape' && session.status === 'dragging') {
          keyEvent.preventDefault();
          cancel();
        }
      };

      // Once the drag starts, a moving finger must not scroll the page. `touch-action` is resolved
      // when the touch starts, so preventing `touchmove` is the only way to stop the scroll then.
      const handleTouchMove = (touchEvent: TouchEvent) => {
        if (session.status === 'dragging' && touchEvent.cancelable) {
          touchEvent.preventDefault();
        }
      };

      // A long press opens the context menu on touch devices.
      const handleContextMenu = (contextMenuEvent: MouseEvent) => {
        if (session.pointerType === 'touch') {
          contextMenuEvent.preventDefault();
        }
      };

      // Pointer events bubble to the document before and after the capture, so listening there
      // covers both, even when the pointer leaves the capture element before the drag starts.
      doc.addEventListener('pointermove', handlePointerMove);
      doc.addEventListener('pointerup', handlePointerUp);
      doc.addEventListener('pointercancel', handlePointerCancel);
      doc.addEventListener('lostpointercapture', handleLostPointerCapture);
      // Capture phase: the focused element can stop the propagation of `Escape`
      doc.addEventListener('keydown', handleKeyDown, true);
      doc.addEventListener('touchmove', handleTouchMove, { passive: false });
      doc.addEventListener('contextmenu', handleContextMenu);

      session.cleanup = () => {
        doc.removeEventListener('pointermove', handlePointerMove);
        doc.removeEventListener('pointerup', handlePointerUp);
        doc.removeEventListener('pointercancel', handlePointerCancel);
        doc.removeEventListener('lostpointercapture', handleLostPointerCapture);
        doc.removeEventListener('keydown', handleKeyDown, true);
        doc.removeEventListener('touchmove', handleTouchMove);
        doc.removeEventListener('contextmenu', handleContextMenu);
      };

      if (session.pointerType === 'touch') {
        session.timeout = setTimeout(
          startDragging,
          optionsRef.current.touchDelay ?? DEFAULT_TOUCH_DELAY,
        );
      }

      sessionRef.current = session;
    },
    [abortDrag, cancel, endSession, getPosition],
  );

  React.useEffect(() => {
    return () => {
      // Remove the listeners without calling the callbacks, the component is gone.
      if (sessionRef.current) {
        endSession(sessionRef.current);
      }
    };
  }, [endSession]);

  return { onPointerDown, cancel };
}

// The browser fires a `click` after the `pointerup` that ends a mouse drag, on the capture element
// or on the common ancestor of the press and release targets.
// It must not trigger the click behavior of the element under the pointer (for example, sorting a column).
function suppressNextClick(doc: Document) {
  const preventClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    doc.removeEventListener('click', preventClick, true);
  };
  doc.addEventListener('click', preventClick, true);
  // Some releases are not followed by a `click`, for example a touch that moved
  setTimeout(() => doc.removeEventListener('click', preventClick, true), SUPPRESS_CLICK_TIMEOUT);
}

// Suppresses the click of the next release of `pointerId`, after a drag was canceled while the button was down.
function suppressClickAfterRelease(doc: Document, pointerId: number) {
  function stopListening() {
    doc.removeEventListener('pointerup', handlePointerUp, true);
    doc.removeEventListener('pointerdown', stopListening, true);
  }
  function handlePointerUp(event: PointerEvent) {
    if (event.pointerId === pointerId) {
      stopListening();
      suppressNextClick(doc);
    }
  }
  doc.addEventListener('pointerup', handlePointerUp, true);
  // Without capture, a release outside the window doesn't reach the document.
  // The next press must not lose its click then.
  doc.addEventListener('pointerdown', stopListening, true);
}
