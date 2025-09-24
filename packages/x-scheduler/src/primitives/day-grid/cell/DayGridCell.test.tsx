import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<DayGrid.Cell />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<DayGrid.Cell value={day} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <DayGrid.Root>
            <DayGrid.Row start={day.startOf('day')} end={day.endOf('day')}>
              {node}
            </DayGrid.Row>
          </DayGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
