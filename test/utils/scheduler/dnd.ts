// Polyfill DragEvent and DataTransfer for JSDOM
import '@atlaskit/pragmatic-drag-and-drop-unit-testing/drag-event-polyfill';

/**
 * Finds the nearest ancestor (or self) that is registered as a draggable element.
 * Pragmatic DnD sets `draggable="true"` on registered elements.
 */
function findDraggableElement(element: Element): HTMLElement {
  const draggable = element.closest('[draggable="true"]') as HTMLElement | null;
  if (!draggable) {
    throw new Error(
      'Could not find a draggable ancestor. Make sure the element or one of its ancestors has draggable="true".',
    );
  }
  return draggable;
}

/**
 * Finds the nearest ancestor (or self) that is registered as a drop target.
 * Pragmatic DnD sets `data-drop-target-for-element` on registered drop target elements.
 */
function findDropTargetElement(element: Element): HTMLElement {
  const dropTarget = element.closest('[data-drop-target-for-element]') as HTMLElement | null;
  if (!dropTarget) {
    throw new Error(
      'Could not find a drop target ancestor. Make sure the element or one of its ancestors is a registered drop target.',
    );
  }
  return dropTarget;
}

function createDragEvent(
  type: string,
  options: { clientX?: number; clientY?: number } = {},
): DragEvent {
  return new DragEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    dataTransfer: new DataTransfer(),
  });
}

interface SimulateDragAndDropParameters {
  /**
   * The element being dragged (or a child of the draggable element).
   * The closest ancestor with `draggable="true"` will be used as the drag source.
   */
  source: Element;
  /**
   * The element to drop onto (or a child of the drop target element).
   * The closest ancestor with `data-drop-target-for-element` will be used as the drop target.
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
}

/**
 * Simulates a complete drag-and-drop operation using native DragEvents.
 *
 * This works with @atlaskit/pragmatic-drag-and-drop because the library:
 * 1. Listens for `dragstart` on `document` and looks up `event.target` in a WeakMap of registered draggables
 * 2. Listens for `dragover`/`drop` on `document` and finds drop targets via `event.target.closest("[data-drop-target-for-element]")`
 *
 * @example
 * ```tsx
 * simulateDragAndDrop({
 *   source: screen.getByRole('button', { name: /my event/i }),
 *   target: dayGridCell,
 * });
 * ```
 */
export function simulateDragAndDrop(parameters: SimulateDragAndDropParameters): void {
  const {
    source,
    target,
    sourceClientX = 0,
    sourceClientY = 0,
    targetClientX = 0,
    targetClientY = 0,
  } = parameters;

  const sourceElement = findDraggableElement(source);
  const targetElement = findDropTargetElement(target);

  // 1. Start the drag on the source element
  sourceElement.dispatchEvent(
    createDragEvent('dragstart', { clientX: sourceClientX, clientY: sourceClientY }),
  );

  // 2. Enter the target (triggers drop target hierarchy detection)
  targetElement.dispatchEvent(
    createDragEvent('dragenter', { clientX: targetClientX, clientY: targetClientY }),
  );

  // 3. Drag over the target (updates placeholder position)
  targetElement.dispatchEvent(
    createDragEvent('dragover', { clientX: targetClientX, clientY: targetClientY }),
  );

  // 4. Drop on the target
  targetElement.dispatchEvent(
    createDragEvent('drop', { clientX: targetClientX, clientY: targetClientY }),
  );

  // 5. End the drag operation
  sourceElement.dispatchEvent(createDragEvent('dragend'));
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
 * Stubs the pointer-capture methods the resize handler relies on, since JSDOM doesn't implement
 * `setPointerCapture` / `hasPointerCapture` / `releasePointerCapture`.
 *
 * The stubs track captured pointer ids so `hasPointerCapture` reflects prior `setPointerCapture` /
 * `releasePointerCapture` calls. A constant `false` would short-circuit the handler's capture-release
 * and unmount-mid-gesture teardown branches (both guarded behind `hasPointerCapture`), leaving them
 * untested.
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
  options: { clientX?: number; clientY?: number; pointerId?: number; button?: number } = {},
): Event {
  const init = {
    bubbles: true,
    cancelable: true,
    clientX: options.clientX ?? 0,
    clientY: options.clientY ?? 0,
    button: options.button ?? 0,
  };
  // `PointerEvent` is not always available in JSDOM; fall back to a `MouseEvent` carrying a
  // `pointerId`, which is all the resize handler reads.
  if (typeof PointerEvent === 'function') {
    return new PointerEvent(type, { ...init, pointerId: options.pointerId ?? 1 });
  }
  const event = new MouseEvent(type, init) as any;
  event.pointerId = options.pointerId ?? 1;
  return event;
}

interface SimulatePointerResizeParameters {
  /**
   * The resize handle element (the one carrying `data-start` / `data-end`).
   */
  handle: HTMLElement;
  /**
   * The final pointer position (where the gesture ends).
   */
  to: { clientX?: number; clientY?: number };
  /**
   * The initial pointer position (where the gesture starts).
   * @default { clientX: 0, clientY: 0 }
   */
  from?: { clientX?: number; clientY?: number };
  /**
   * The pointer id to use for the gesture.
   * @default 1
   */
  pointerId?: number;
  /**
   * Whether to end the gesture with `pointercancel` instead of `pointerup`.
   * @default false
   */
  cancel?: boolean;
}

/**
 * Simulates a pointer-driven resize gesture (pointerdown → pointermove → pointerup/cancel) on a
 * resize handle, for the touch resize path (`useEventPointerResizeHandler`).
 *
 * Pair with {@link mockElementBounds} on the column so the gesture maps to a known time.
 *
 * @example
 * ```tsx
 * const handle = getResizeHandle(eventElement, 'end');
 * simulatePointerResize({ handle, to: { clientY: clientYForTime(0, 24, 15) } });
 * ```
 */
export function simulatePointerResize(parameters: SimulatePointerResizeParameters): void {
  const { handle, to, from = {}, pointerId = 1, cancel = false } = parameters;
  ensurePointerCaptureMethods(handle);

  const down = { clientX: from.clientX ?? 0, clientY: from.clientY ?? 0 };
  const move = { clientX: to.clientX ?? down.clientX, clientY: to.clientY ?? down.clientY };

  handle.dispatchEvent(createPointerEvent('pointerdown', { ...down, pointerId, button: 0 }));
  handle.dispatchEvent(createPointerEvent('pointermove', { ...move, pointerId }));
  handle.dispatchEvent(
    createPointerEvent(cancel ? 'pointercancel' : 'pointerup', { ...move, pointerId }),
  );
}
