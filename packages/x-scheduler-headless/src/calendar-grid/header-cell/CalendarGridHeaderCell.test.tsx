import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.DayRow />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.HeaderCell />, () => ({
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
});
