// Helpers for drags built on `usePointerDrag`.
// Like the hook, they must not depend on the Data Grid, so they can be moved to `@mui/x-internals`.

// Smaller than a row, so picking up the first or last visible row doesn't scroll right away
const EDGE_SCROLL_SIZE = 24;
const EDGE_SCROLL_MAX_SPEED = 20;

/**
 * Returns how far to scroll in one frame when the pointer is close to the start or end edge of a scrollable area.
 * The speed grows as the pointer gets closer to, or goes past, the edge.
 * It works for both axes: pass `clientY` with the top and bottom edges, or `clientX` with the left and right ones.
 * @param {number} position The pointer position on the scroll axis.
 * @param {number} start The start edge of the area: top or left.
 * @param {number} end The end edge of the area: bottom or right.
 * @returns {number} The scroll delta in px: negative scrolls toward the start, positive toward the end, `0` doesn't scroll.
 */
export function getEdgeScrollDelta(position: number, start: number, end: number): number {
  if (position < start + EDGE_SCROLL_SIZE) {
    const ratio = Math.min(1, (start + EDGE_SCROLL_SIZE - position) / EDGE_SCROLL_SIZE);
    return -Math.ceil(ratio * EDGE_SCROLL_MAX_SPEED);
  }
  if (position > end - EDGE_SCROLL_SIZE) {
    const ratio = Math.min(1, (position - (end - EDGE_SCROLL_SIZE)) / EDGE_SCROLL_SIZE);
    return Math.ceil(ratio * EDGE_SCROLL_MAX_SPEED);
  }
  return 0;
}

export interface DragPreview {
  element: HTMLElement;
  /**
   * Moves the preview so it keeps its offset from the pointer.
   * @param {number} clientX The horizontal pointer position.
   * @param {number} clientY The vertical pointer position.
   */
  move: (clientX: number, clientY: number) => void;
  remove: () => void;
}

// Attributes that give the copy the identity of the source: queries, focus and assistive technologies
// must not find the preview instead of the real element.
const isIdentityAttribute = (name: string) =>
  name === 'id' ||
  name === 'role' ||
  name === 'tabindex' ||
  name.startsWith('aria-') ||
  name.startsWith('data-');

function removeIdentityAttributes(element: Element) {
  Array.from(element.attributes).forEach((attribute) => {
    if (isIdentityAttribute(attribute.name)) {
      element.removeAttribute(attribute.name);
    }
  });
}

/**
 * Creates a copy of `source` that follows the pointer, in place of the drag image of HTML drag and drop.
 * The copy keeps the look of the source, but not its identity: ids, roles, `tabindex`, `aria-*` and `data-*`
 * attributes are removed, and it's `inert`, hidden from assistive technologies, and transparent to hit-testing.
 * @param {HTMLElement} source The element to copy, for example the drag handle.
 * @param {object} options The preview options.
 * @param {HTMLElement} options.container A positioned element to render the preview in.
 * @param {number} options.clientX The horizontal pointer position when the drag started.
 * @param {number} options.clientY The vertical pointer position when the drag started.
 * @param {string} options.className Space-separated classes to add to the preview.
 * @returns {DragPreview} The preview, already rendered at the pointer position.
 */
export function createDragPreview(
  source: HTMLElement,
  options: { container: HTMLElement; clientX: number; clientY: number; className?: string },
): DragPreview {
  const { container, clientX, clientY, className } = options;
  const sourceRect = source.getBoundingClientRect();
  const offsetX = clientX - sourceRect.left;
  const offsetY = clientY - sourceRect.top;

  const element = source.cloneNode(true) as HTMLElement;
  removeIdentityAttributes(element);
  element.querySelectorAll('*').forEach(removeIdentityAttributes);
  if (className) {
    element.classList.add(...className.split(' ').filter(Boolean));
  }
  element.setAttribute('aria-hidden', 'true');
  element.setAttribute('inert', '');
  Object.assign(element.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    margin: '0',
    pointerEvents: 'none',
    zIndex: '100',
  });

  const move = (x: number, y: number) => {
    const containerRect = container.getBoundingClientRect();
    element.style.transform = `translate(${x - containerRect.left - offsetX}px, ${y - containerRect.top - offsetY}px)`;
  };

  container.appendChild(element);
  move(clientX, clientY);

  return { element, move, remove: () => element.remove() };
}
