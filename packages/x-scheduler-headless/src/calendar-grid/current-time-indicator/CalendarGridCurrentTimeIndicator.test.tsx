import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<CalendarGrid.CurrentTimeIndicator />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<CalendarGrid.CurrentTimeIndicator />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={day.startOf('day')} end={day.endOf('day')}>
              {node}
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
