import { screen, within } from '@mui/internal-test-utils';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { mockElementBounds } from './dnd';

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
 * Returns the month grid cell for a given day-of-month number, scoped to the month view
 * so the side panel's mini calendar (same day numbers) cannot match.
 */
export function getMonthViewCell(dayOfMonth: number): HTMLElement {
  const cells = withinMonthView().getAllByRole('gridcell');
  const cell = cells.find((c) => within(c).queryByText(new RegExp(`^${dayOfMonth}$`)));
  if (!cell) {
    throw new Error(`Could not find month view cell for day ${dayOfMonth}`);
  }
  return cell;
}

/**
 * Matches the accessible name of a rendered event with the default English composition, which
 * starts with the title. The lookups below also match `aria-hidden` copies of multi-day events;
 * use `getByRole('button', { name })` to assert on the exposed name.
 */
export function getEventNamePattern(title: string) {
  return new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`);
}

export function getEventByTitle(title: string) {
  return screen.getByLabelText(getEventNamePattern(title));
}

export function getAllEventsByTitle(title: string) {
  return screen.getAllByLabelText(getEventNamePattern(title));
}

/**
 * Returns the drop targets of the time grid columns in DOM order, one per rendered day.
 */
export function getTimeGridColumns(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(`.MuiEventCalendar-dayTimeGridColumn`));
}

/**
 * Returns the drop target of the first time grid column, the only one of a day view.
 */
export function getTimeGridColumn(): HTMLElement {
  const [column] = getTimeGridColumns();
  if (!column) {
    throw new Error('Could not find a time grid column');
  }
  return column;
}

/**
 * Returns the timeline event row for a given resource id.
 */
export function getEventRow(resourceId: string): HTMLElement {
  const row = document.querySelector<HTMLElement>(
    `.MuiEventTimeline-eventsCell[data-resource-id="${resourceId}"]`,
  );
  if (!row) {
    throw new Error(`Could not find event row for resource "${resourceId}"`);
  }
  return row;
}

/**
 * Applies mock bounds to all timeline event rows, so jsdom drops resolve positions.
 */
export function mockAllEventRowBounds(width = 6720) {
  const rows = document.querySelectorAll<HTMLElement>(`.MuiEventTimeline-eventsCell`);
  for (const row of rows) {
    mockElementBounds(row, { left: 0, width, height: 40 });
  }
  return rows;
}
