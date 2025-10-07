import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.DayRow />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(
    <CalendarGrid.DayRow start={day.startOf('day')} end={day.endOf('day')} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>{node}</CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
