/**
 * Marks the elements a calendar grid cell lets the keyboard move through once it is entered
 * (Enter or F2): the day number button, the events, the "+N more" button.
 * Events set it to their occurrence key, so a copy of a multi-day event rendered in another cell of
 * the row can point to the visible one.
 */
export const CALENDAR_GRID_ITEM_ATTRIBUTE = 'data-calendar-grid-item';

/**
 * The props of an element of a cell that is not an event, like the day number button.
 * The items are never in the Tab sequence: the grid has a single tab stop, one of its cells.
 */
export const CALENDAR_GRID_ITEM_PROPS = getCalendarGridItemProps('');

/**
 * The props marking an element as an item of its cell, `key` being the occurrence key of an event.
 */
export function getCalendarGridItemProps(key: string): CalendarGridItemProps {
  return { [CALENDAR_GRID_ITEM_ATTRIBUTE]: key, tabIndex: -1 };
}

export interface CalendarGridItemProps {
  [CALENDAR_GRID_ITEM_ATTRIBUTE]: string;
  tabIndex: number;
}

/**
 * The items of a cell, in DOM order.
 * An `aria-hidden` event (the copy of a multi-day event that starts in an earlier cell of the row)
 * is replaced by the visible event of the row with the same occurrence key.
 */
export function getCalendarGridCellItems(cell: HTMLElement): HTMLElement[] {
  const selector = `[${CALENDAR_GRID_ITEM_ATTRIBUTE}]`;
  const row = cell.closest<HTMLElement>('[role="row"]') ?? cell;
  const items: HTMLElement[] = [];

  cell.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    let item: HTMLElement | undefined = element;
    if (isHidden(element)) {
      const key = element.getAttribute(CALENDAR_GRID_ITEM_ATTRIBUTE);
      item = key
        ? Array.from(row.querySelectorAll<HTMLElement>(selector)).find(
            (candidate) =>
              candidate.getAttribute(CALENDAR_GRID_ITEM_ATTRIBUTE) === key && !isHidden(candidate),
          )
        : undefined;
    }
    if (item != null && !items.includes(item)) {
      items.push(item);
    }
  });

  return items;
}

/**
 * The move between items an arrow key makes: 1 to the next one, -1 to the previous one, 0 for
 * another key.
 */
export function getCalendarGridItemOffset(key: string, isRtl: boolean): -1 | 0 | 1 {
  if (key === 'ArrowDown' || key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) {
    return 1;
  }
  if (key === 'ArrowUp' || key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) {
    return -1;
  }
  return 0;
}

/**
 * Focuses the item at `index`, wrapping around the list.
 */
export function focusCalendarGridItem(items: HTMLElement[], index: number) {
  items[(index + items.length) % items.length]?.focus();
}

function isHidden(element: HTMLElement) {
  return element.getAttribute('aria-hidden') === 'true';
}
