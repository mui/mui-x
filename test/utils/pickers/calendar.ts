import { fireEvent } from '@mui/internal-test-utils';

const POINTER_ID = 1;

/**
 * Replays the pointer half of a drag-to-edit gesture across day cells:
 * pointerdown on the source, pointerover on each subsequent cell. Use
 * `executeDateDrag` to also commit the drop.
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
  // Fire `pointerup` on the cell the user landed on (it bubbles to our
  // document-level listener), not on `document` directly. The production
  // handler reads `event.target` to determine the drop cell and cancels if
  // it isn't inside a day.
  const dropTarget = otherDates.at(-1) ?? startDate;
  fireEvent.pointerUp(dropTarget, { pointerId: POINTER_ID });
};
