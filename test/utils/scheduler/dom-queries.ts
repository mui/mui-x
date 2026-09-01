import { screen, within } from '@mui/internal-test-utils';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';

/**
 * Returns a `within` scope for the EventCalendar header toolbar.
 * Use this to scope queries to the header toolbar when testing EventCalendar components.
 *
 * @example
 * const toolbar = withinEventCalendarToolbar();
 * await user.click(toolbar.getByRole('button', { name: /next month/i }));
 */
export function withinEventCalendarToolbar() {
  const toolbar = document.querySelector(`.${eventCalendarClasses.headerToolbar}`);

  if (!toolbar) {
    throw new Error('Could not find EventCalendar header toolbar');
  }

  return within(toolbar as HTMLElement);
}

/**
 * Returns a `within` scope for the MonthView component.
 * Use this to scope queries to the month view (excludes the side panel with mini calendar).
 *
 * @example
 * const monthView = withinMonthView();
 * expect(monthView.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
 */
export function withinMonthView() {
  const monthView = document.querySelector(`.${eventCalendarClasses.monthView}`);

  if (!monthView) {
    throw new Error('Could not find MonthView');
  }

  return within(monthView as HTMLElement);
}

/**
 * Returns the droppable month grid cell for a given day-of-month number (the date picker
 * in the side panel exposes gridcells with the same day numbers, so only cells wired as
 * drop targets qualify).
 */
export function getMonthViewCell(dayOfMonth: number): HTMLElement {
  const cells = screen.getAllByRole('gridcell');
  const cell = cells.find(
    (c) =>
      (c.matches('[data-drop-target-for-element]') ||
        c.querySelector('[data-drop-target-for-element]') != null) &&
      within(c).queryByText(new RegExp(`^${dayOfMonth}$`)),
  );
  if (!cell) {
    throw new Error(`Could not find month view cell for day ${dayOfMonth}`);
  }
  return cell;
}
