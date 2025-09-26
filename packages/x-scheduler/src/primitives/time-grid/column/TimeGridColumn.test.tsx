import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.Column />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(
    <TimeGrid.Column start={day.startOf('day')} end={day.endOf('day')} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <TimeGrid.Root>{node}</TimeGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
