import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.CurrentTimeIndicator />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<TimeGrid.CurrentTimeIndicator />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <TimeGrid.Root>
            <TimeGrid.Column start={day.startOf('day')} end={day.endOf('day')}>
              {node}
            </TimeGrid.Column>
          </TimeGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
