import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<CalendarGrid.HeaderCell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <CalendarGrid.HeaderCell date={processDate(adapter.now('default'), adapter)} />,
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
    it('should have tabIndex="-1" (programmatically focusable, not in tab order)', () => {
      render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.HeaderRow>
              <CalendarGrid.HeaderCell date={processDate(adapter.now('default'), adapter)} />
            </CalendarGrid.HeaderRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
      const cell = screen.getByRole('columnheader');
      expect(cell).to.have.attribute('tabindex', '-1');
    });
  });
});
