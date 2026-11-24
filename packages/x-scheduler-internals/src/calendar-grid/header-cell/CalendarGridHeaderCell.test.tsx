import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { createSchedulerRenderer, describeConformance, processDay } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { vi, describe, it, expect } from 'vitest';

describe('<CalendarGrid.HeaderCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = new Date();

  describeConformance(<CalendarGrid.HeaderCell date={processDay(day)} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>{node}</CalendarGrid.HeaderRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));

  describe('keyboard interactions', () => {
    it('should delegate Enter keypress to the child button', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>
              <CalendarGrid.HeaderCell date={processDay(day)}>
                <button type="button" onClick={onClick}>
                  Click me
                </button>
              </CalendarGrid.HeaderCell>
            </CalendarGrid.HeaderRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );

      const header = screen.getByRole('columnheader');
      await user.click(header);
      await user.keyboard('{Enter}');

      expect(onClick.mock.calls.length).to.equal(1);
    });

    it('should not throw when Enter is pressed without a child button', async () => {
      const { user } = render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>
              <CalendarGrid.HeaderCell date={processDay(day)}>Monday</CalendarGrid.HeaderCell>
            </CalendarGrid.HeaderRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );

      const header = screen.getByRole('columnheader');
      await user.click(header);
      // Should not throw
      await user.keyboard('{Enter}');
    });
  });
});
