import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarGrid } from '@mui/x-scheduler/primitives/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<CalendarGrid.DayCell />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<CalendarGrid.DayCell value={day} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.DayRow start={day.startOf('day')} end={day.endOf('day')}>
              {node}
            </CalendarGrid.DayRow>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
