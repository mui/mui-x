import { fireEvent } from '@mui/internal-test-utils';

interface DragPointerOptions {
  clientX?: number;
  clientY?: number;
  pointerType?: string;
  mockHitTest?: boolean;
}

let restoreDragHitTest: (() => void) | undefined;
let dragPoint = { clientX: 0, clientY: 0 };
let hitElement: Element | null = null;

function mockDragHitTest(element: Element) {
  hitElement = element;
  if (restoreDragHitTest) {
    return;
  }
  const doc = element.ownerDocument;
  const original = Object.getOwnPropertyDescriptor(doc, 'elementFromPoint');
  Object.defineProperty(doc, 'elementFromPoint', {
    configurable: true,
    value: () => hitElement,
  });
  restoreDragHitTest = () => {
    if (original) {
      Object.defineProperty(doc, 'elementFromPoint', original);
    } else {
      delete (doc as Partial<Document>).elementFromPoint;
    }
    restoreDragHitTest = undefined;
    hitElement = null;
  };
}

function dispatchDragPointer(type: string, element: Element, options: DragPointerOptions = {}) {
  dragPoint = {
    clientX: options.clientX ?? dragPoint.clientX,
    clientY: options.clientY ?? dragPoint.clientY,
  };
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: options.pointerType ?? 'mouse',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    ...dragPoint,
  });
  fireEvent(element, event);
}

/** Starts a mouse drag at the supplied point, crossing the engine's activation threshold. */
export function startDrag(element: Element, options: DragPointerOptions = {}) {
  if (options.mockHitTest !== false) {
    mockDragHitTest(element);
  }
  const clientX = options.clientX ?? 0;
  const clientY = options.clientY ?? 0;
  dispatchDragPointer('pointerdown', element, { ...options, clientX: clientX - 6, clientY });
  dispatchDragPointer('pointermove', element, { ...options, clientX, clientY });
}

/** Moves an active drag over a target. Hit testing is mocked because jsdom has no layout. */
export function moveDrag(element: Element, options: DragPointerOptions = {}) {
  mockDragHitTest(element);
  dispatchDragPointer('pointermove', element, options);
}

/** Releases over a target. Base UI flushes the pending move before committing the drop. */
export function dropDrag(element: Element, options: DragPointerOptions = {}) {
  mockDragHitTest(element);
  dispatchDragPointer('pointerup', element, options);
  // Pointer capture redirects the browser's compatibility click to the body.
  // Deliver it so Base UI consumes it instead of swallowing a later test's click.
  fireEvent(
    element.ownerDocument.body,
    new PointerEvent('click', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: options.pointerType ?? 'mouse',
      detail: 1,
    }),
  );
  restoreDragHitTest?.();
}

/** Cancels the active drag and restores hit testing, including after an assertion fails. */
export function cancelDrag() {
  dispatchDragPointer('pointercancel', document.body);
  restoreDragHitTest?.();
}

interface SimulateDragAndDropParameters {
  /**
   * The element being dragged (or a child of the draggable element).
   * The pointer press bubbles to the registered drag source.
   */
  source: Element;
  /**
   * The element to drop onto (or a child of the drop target element).
   * The closest ancestor with `data-drop-target` will be used as the drop target.
   */
  target: Element;
  /**
   * The clientX coordinate for the drag start position.
   * Relevant for day grid event drags where the X position determines which day is being dragged.
   * @default 0
   */
  sourceClientX?: number;
  /**
   * The clientY coordinate for the drag start position.
   * @default 0
   */
  sourceClientY?: number;
  /**
   * The clientX coordinate for the drop position.
   * @default 0
   */
  targetClientX?: number;
  /**
   * The clientY coordinate for the drop position.
   * Relevant for time grid drops where the Y position determines the time.
   * @default 0
   */
  targetClientY?: number;
  /**
   * Stop after the pointer move, leaving the drag in progress so the placeholder stays on screen and
   * can be asserted on.
   * @default false
   */
  hold?: boolean;
}

/** Simulates the pointer gesture used by Scheduler event moves and resize handles. */
export function simulateDragAndDrop(parameters: SimulateDragAndDropParameters): void {
  const {
    source,
    target,
    sourceClientX = 0,
    sourceClientY = 0,
    targetClientX = 0,
    targetClientY = 0,
    hold = false,
  } = parameters;

  startDrag(source, { clientX: sourceClientX, clientY: sourceClientY });
  moveDrag(target, { clientX: targetClientX, clientY: targetClientY });
  if (!hold) {
    dropDrag(target, { clientX: targetClientX, clientY: targetClientY });
  }
}

interface MockElementBoundsRect {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

/**
 * Mocks `getBoundingClientRect()`, `offsetHeight`, and `offsetWidth` on a DOM element.
 *
 * Needed for:
 * - Time grid column drops where the cursor's Y position determines the event time
 * - Day grid event drags where the element width is used to compute the dragged day
 * - Timeline row drops where the cursor's X position determines the event time
 *
 * @example
 * ```tsx
 * // A column that spans 1440px (1px per minute of the day)
 * mockElementBounds(columnElement, { top: 0, height: 1440, width: 200 });
 * ```
 */
export function mockElementBounds(element: HTMLElement, rect: MockElementBoundsRect): void {
  const fullRect = {
    top: rect.top ?? 0,
    left: rect.left ?? 0,
    width: rect.width ?? 200,
    height: rect.height ?? 1440,
    get bottom() {
      return this.top + this.height;
    },
    get right() {
      return this.left + this.width;
    },
    get x() {
      return this.left;
    },
    get y() {
      return this.top;
    },
    toJSON() {
      return {};
    },
  };

  element.getBoundingClientRect = () => fullRect as DOMRect;
  Object.defineProperty(element, 'offsetHeight', {
    value: fullRect.height,
    configurable: true,
  });
  Object.defineProperty(element, 'offsetWidth', {
    value: fullRect.width,
    configurable: true,
  });
}

/**
 * Calculates the `clientY` value that corresponds to a target hour in a time grid column.
 *
 * Assumes the column element has top=0 and height = (endHour - startHour) * 60 pixels
 * (i.e., 1 pixel per minute), matching the default mock from `mockElementBounds`.
 *
 * @param startHour - The hour at which the column starts (e.g., 0 for midnight)
 * @param endHour - The hour at which the column ends (e.g., 24 for end of day)
 * @param targetHour - The desired hour (e.g., 14.5 for 2:30 PM)
 * @returns The clientY value to use in `simulateDragAndDrop`
 *
 * @example
 * ```tsx
 * // Column spans midnight to midnight (24 hours), target is 2:00 PM
 * const clientY = clientYForTime(0, 24, 14); // returns 840
 * ```
 */
export function clientYForTime(startHour: number, endHour: number, targetHour: number): number {
  const totalMinutes = (endHour - startHour) * 60;
  const targetMinutes = (targetHour - startHour) * 60;
  // With the default 1px-per-minute mapping, clientY equals the minute offset
  return (targetMinutes / totalMinutes) * totalMinutes;
}

/**
 * Finds the resize handle element (start or end) within an event element.
 *
 * Resize handlers are rendered as child elements with `data-start` or `data-end`
 * attributes. They are only present when resizing is enabled for the event
 * (via `areEventsResizable` on the component or `resizable` on the event).
 *
 * @param eventElement - The event DOM element containing the resize handle
 * @param side - Which resize handle to find: `'start'` or `'end'`
 * @returns The resize handle element
 *
 * @example
 * ```tsx
 * const eventElement = screen.getByRole('button', { name: /my event/i });
 * const endHandle = getResizeHandle(eventElement, 'end');
 * simulateDragAndDrop({ source: endHandle, target: column, targetClientY });
 * ```
 */
export function getResizeHandle(eventElement: HTMLElement, side: 'start' | 'end'): HTMLElement {
  const handle = eventElement.querySelector<HTMLElement>(`[data-${side}]`);
  if (!handle) {
    throw new Error(
      `Could not find ${side} resize handle. Make sure the event has areEventsResizable or resizable enabled.`,
    );
  }
  return handle;
}

/**
 * Stubs the pointer-capture methods JSDOM lacks. Tracks captured ids so `hasPointerCapture` reflects
 * prior set/release calls; a constant `false` would skip the handler's capture-release and
 * unmount-mid-gesture teardown branches.
 */
function ensurePointerCaptureMethods(element: HTMLElement): void {
  const target = element as any;
  if (
    typeof target.setPointerCapture === 'function' &&
    typeof target.hasPointerCapture === 'function' &&
    typeof target.releasePointerCapture === 'function'
  ) {
    return;
  }
  const capturedPointers = new Set<number>();
  target.setPointerCapture = (pointerId: number) => {
    capturedPointers.add(pointerId);
  };
  target.releasePointerCapture = (pointerId: number) => {
    capturedPointers.delete(pointerId);
  };
  target.hasPointerCapture = (pointerId: number) => capturedPointers.has(pointerId);
}

function createPointerEvent(
  type: string,
  options: {
    clientX?: number;
    clientY?: number;
    pointerId?: number;
    button?: number;
    pointerType?: string;
  } = {},
): Event {
  const init = {
    bubbles: true,
    cancelable: true,
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    button: options.button ?? 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    isPrimary: true,
    pointerType: options.pointerType ?? 'touch',
  };
  // `PointerEvent` may be missing in JSDOM; fall back to a `MouseEvent` with a `pointerId`.
  if (typeof PointerEvent === 'function') {
    return new PointerEvent(type, { ...init, pointerId: options.pointerId ?? 1 });
  }
  const event = new MouseEvent(type, init) as any;
  event.pointerId = options.pointerId ?? 1;
  event.pointerType = init.pointerType;
  event.isPrimary = true;
  return event;
}

interface SimulatePointerResizeParameters {
  /** The resize handle element (carries `data-start` / `data-end`). */
  handle: HTMLElement;
  /** Final pointer position (gesture end). */
  to: { clientX?: number; clientY?: number };
  /**
   * Initial pointer position (gesture start).
   * @default { clientX: 0, clientY: 0 }
   */
  from?: { clientX?: number; clientY?: number };
  /**
   * Pointer id for the gesture.
   * @default 1
   */
  pointerId?: number;
  /** The input device, defaulting to touch. */
  pointerType?: 'touch' | 'pen';
  /**
   * End with `pointercancel` instead of `pointerup`.
   * @default false
   */
  cancel?: boolean;
  /**
   * Stop after the `pointermove`, leaving the gesture in progress so the resize placeholder stays on
   * screen and can be asserted on.
   * @default false
   */
  hold?: boolean;
}

/**
 * Simulates a pointer resize gesture (pointerdown → pointermove → pointerup/cancel) for the touch
 * resize path (`useEventPointerResizeHandler`). Pair with {@link mockElementBounds} on the column so
 * the gesture maps to a known time.
 *
 * @example
 * ```tsx
 * const handle = getResizeHandle(eventElement, 'end');
 * simulatePointerResize({ handle, to: { clientY: clientYForTime(0, 24, 15) } });
 * ```
 */
export function simulatePointerResize(parameters: SimulatePointerResizeParameters): void {
  const {
    handle,
    to,
    from = {},
    pointerId = 1,
    pointerType = 'touch',
    cancel = false,
    hold = false,
  } = parameters;
  ensurePointerCaptureMethods(handle);

  const down = { clientX: from.clientX ?? 0, clientY: from.clientY ?? 0 };
  const move = { clientX: to.clientX ?? down.clientX, clientY: to.clientY ?? down.clientY };

  handle.dispatchEvent(
    createPointerEvent('pointerdown', { ...down, pointerId, pointerType, button: 0 }),
  );
  handle.dispatchEvent(createPointerEvent('pointermove', { ...move, pointerId, pointerType }));
  if (hold) {
    return;
  }
  handle.dispatchEvent(
    createPointerEvent(cancel ? 'pointercancel' : 'pointerup', { ...move, pointerId, pointerType }),
  );
}
