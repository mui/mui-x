import type { RefObject } from '@mui/x-internals/types';
import { gridRowNodeSelector } from '@mui/x-data-grid';
import type { GridRowId } from '@mui/x-data-grid';
import type { RowReorderDropPosition } from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import { findCellElement } from './utils';

// Helpers for the pointer events path of row reordering (`useGridRowReorderPointer`).
// The HTML drag and drop path (`useGridRowReorder`) keeps its own copy of this logic,
// so the pointer path can't change its behavior.

// Smaller than a row, so picking up the first or last visible row doesn't scroll right away
const AUTO_SCROLL_EDGE_SIZE = 24;
const AUTO_SCROLL_MAX_SPEED = 20;

/**
 * Returns the id of a row element.
 * `data-id` is always a string, while row ids can also be numbers.
 * @param {RefObject<GridPrivateApiPro>} apiRef The grid API.
 * @param {Element} rowElement The row element.
 * @returns {GridRowId | null} The row id, or `null` when the element isn't a row of the grid.
 */
export function getRowIdFromElement(
  apiRef: RefObject<GridPrivateApiPro>,
  rowElement: Element,
): GridRowId | null {
  const dataId = rowElement.getAttribute('data-id');
  if (dataId === null) {
    return null;
  }
  // The row tree is keyed by `String(id)`, so the string finds the node of a numeric id too.
  // The node has the id with its original type.
  return gridRowNodeSelector(apiRef, dataId)?.id ?? null;
}

/**
 * Returns where a dragged row would be dropped relative to the row under the pointer.
 * @param {Element} rowElement The row under the pointer.
 * @param {Element} elementAtPoint The element under the pointer.
 * @param {number} clientY The vertical pointer position.
 * @param {boolean} isTreeData Whether the grid uses tree data.
 * @returns {RowReorderDropPosition} The drop position.
 */
export function getRowDropPosition(
  rowElement: Element,
  elementAtPoint: Element,
  clientY: number,
  isTreeData: boolean,
): RowReorderDropPosition {
  // For tree data, the cell is measured to avoid flickering in the top 20% zone
  const targetElement = isTreeData ? findCellElement(elementAtPoint) : rowElement;
  const targetRect = targetElement.getBoundingClientRect();
  const relativeY = Math.floor(clientY - targetRect.top);

  if (isTreeData) {
    // For tree data: top 20% = above, middle 60% = inside, bottom 20% = below
    if (relativeY < targetRect.height * 0.2) {
      return 'above';
    }
    if (relativeY > targetRect.height * 0.8) {
      return 'below';
    }
    return 'inside';
  }
  // For flat data and row grouping: split at the midpoint
  return relativeY < targetRect.height / 2 ? 'above' : 'below';
}

/**
 * Returns how far to scroll in one frame when the pointer is close to the top or bottom edge of the rows.
 * The speed grows as the pointer gets closer to, or goes past, the edge.
 * @param {number} clientY The vertical pointer position.
 * @param {number} top The top edge of the rows area.
 * @param {number} bottom The bottom edge of the rows area.
 * @returns {number} The scroll delta in px: negative scrolls up, positive scrolls down, `0` doesn't scroll.
 */
export function getAutoScrollDelta(clientY: number, top: number, bottom: number): number {
  if (clientY < top + AUTO_SCROLL_EDGE_SIZE) {
    const ratio = Math.min(1, (top + AUTO_SCROLL_EDGE_SIZE - clientY) / AUTO_SCROLL_EDGE_SIZE);
    return -Math.ceil(ratio * AUTO_SCROLL_MAX_SPEED);
  }
  if (clientY > bottom - AUTO_SCROLL_EDGE_SIZE) {
    const ratio = Math.min(1, (clientY - (bottom - AUTO_SCROLL_EDGE_SIZE)) / AUTO_SCROLL_EDGE_SIZE);
    return Math.ceil(ratio * AUTO_SCROLL_MAX_SPEED);
  }
  return 0;
}

/**
 * Animates the rendered rows from their position before `callback` to their position after it.
 * @param {HTMLElement} rootElement The grid root element.
 * @param {() => void | Promise<void>} callback Moves the rows.
 * @returns {Promise<void>} Resolves once `callback` resolved.
 */
export async function animateRowMove(
  rootElement: HTMLElement,
  callback: () => void | Promise<void>,
): Promise<void> {
  const initialPositions = new Map<string, DOMRect>();
  rootElement.querySelectorAll<HTMLElement>('[data-id]').forEach((row) => {
    const rowId = row.getAttribute('data-id');
    if (rowId) {
      initialPositions.set(rowId, row.getBoundingClientRect());
    }
  });

  await callback();

  // Wait for the DOM to update
  requestAnimationFrame(() => {
    rootElement.querySelectorAll<HTMLElement>('[data-id]').forEach((row) => {
      const prevRect = initialPositions.get(row.getAttribute('data-id') ?? '');
      if (!prevRect) {
        return;
      }
      const deltaY = prevRect.top - row.getBoundingClientRect().top;
      if (Math.abs(deltaY) > 1) {
        row.animate([{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }], {
          duration: 200,
          easing: 'ease-in-out',
          fill: 'forwards',
        });
      }
    });
  });
}
