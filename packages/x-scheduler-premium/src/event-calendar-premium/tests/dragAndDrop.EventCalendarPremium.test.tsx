import { screen, within, act } from '@mui/internal-test-utils';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  adapter,
  createSchedulerRenderer,
  utcJuly4AllDayBuilder,
  simulateDragAndDrop,
  mockElementBounds,
} from 'test/utils/scheduler';
import { vi, describe, it, expect } from 'vitest';

/**
 * Returns the droppable month grid cell for a given day-of-month number (the date
 * picker in the sidebar exposes gridcells with the same day numbers, so only cells
 * wired as drop targets qualify).
 */
function getMonthViewCell(dayOfMonth: number): HTMLElement {
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

describe('EventCalendarPremium - Month view drag and drop', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  it('should exclude the dragged occurrence of its own day when moved from another timezone', async () => {
    const handleEventsChange = vi.fn();
    // A UTC all-day weekly series whose display bounds normalize to New York July 3rd,
    // so the day grid renders it a cell earlier than its data-timezone day.
    const event = utcJuly4AllDayBuilder()
      .title('Weekly sync')
      .recurrent('WEEKLY')
      .draggable(true)
      .build();

    const { user } = render(
      <EventCalendarPremium
        events={[event]}
        visibleDate={adapter.date('2025-07-03T00:00:00Z', 'default')}
        view="month"
        views={['month']}
        displayTimezone="America/New_York"
        onEventsChange={handleEventsChange}
      />,
    );

    const eventElement = screen.getAllByRole('button', { name: /Weekly sync/i })[0];
    mockElementBounds(eventElement, { left: 0, width: 100 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getMonthViewCell(8),
        sourceClientX: 50,
      });
    });

    // A recurring drop opens the scope dialog.
    await user.click(await screen.findByText(/Only this event/i));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The exception lands on the occurrence's own July 4th, not the displayed July
    // 3rd — the day grid threads the data-timezone bounds into the drag data.
    const updatedEvents = handleEventsChange.mock.lastCall?.[0];
    const series = updatedEvents.find((item: { id: string }) => item.id === event.id)!;
    expect(series.exDates).to.have.length(1);
    expect(
      adapter.formatByString(adapter.date(String(series.exDates[0]), 'UTC'), 'yyyy-MM-dd'),
    ).to.equal('2025-07-04');
  });
});
