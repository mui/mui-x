import { fireEvent } from '@mui/internal-test-utils';

const POINTER_ID = 1;

/**
 * Replays a pointer drag across day cells: pointerdown on the source, then
 * pointerover on each subsequent cell, then pointerup. Used to test the
 * DateRangeCalendar drag-to-edit interaction in jsdom. We fire `pointerover`
 * (bubbles) rather than `pointerenter` (doesn't bubble) so React's delegated
 * listener picks the events up.
 */
export const executeDateDragWithoutDrop = (startDate: Element, ...otherDates: Element[]) => {
  // `isPrimary: true` matches what real browsers produce for a first-finger
  // touch / mouse press; the production handler short-circuits secondary
  // multi-touch pointers via `event.isPrimary === false`.
  fireEvent.pointerDown(startDate, { pointerId: POINTER_ID, button: 0, isPrimary: true });
  otherDates.forEach((date) => {
    fireEvent.pointerOver(date, { pointerId: POINTER_ID });
  });
};

export const executeDateDrag = (startDate: Element, ...otherDates: Element[]) => {
  executeDateDragWithoutDrop(startDate, ...otherDates);
  fireEvent.pointerUp(document, { pointerId: POINTER_ID });
};
