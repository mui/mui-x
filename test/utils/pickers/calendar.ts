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
  fireEvent.pointerDown(startDate, { pointerId: POINTER_ID, button: 0 });
  otherDates.forEach((date) => {
    fireEvent.pointerOver(date, { pointerId: POINTER_ID });
  });
};

export const executeDateDrag = (startDate: Element, ...otherDates: Element[]) => {
  executeDateDragWithoutDrop(startDate, ...otherDates);
  fireEvent.pointerUp(document, { pointerId: POINTER_ID });
};
