import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<CalendarGrid.ScrollableContent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.ScrollableContent />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>{node}</CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
