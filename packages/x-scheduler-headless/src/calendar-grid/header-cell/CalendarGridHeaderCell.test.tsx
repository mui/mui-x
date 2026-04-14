import * as React from 'react';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<CalendarGrid.HeaderCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(
    <CalendarGrid.HeaderCell date={processDate(day, adapter)} />,
    () => ({
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
    }),
  );

  describe('keyboard interactions', () => {
    it('should delegate Enter keypress to the child button', async () => {
      const onClick = spy();
      const { user } = render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>
              <CalendarGrid.HeaderCell date={processDate(day, adapter)}>
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

      expect(onClick.calledOnce).to.equal(true);
    });

    it('should not throw when Enter is pressed without a child button', async () => {
      const { user } = render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>
              <CalendarGrid.HeaderCell date={processDate(day, adapter)}>
                Monday
              </CalendarGrid.HeaderCell>
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
