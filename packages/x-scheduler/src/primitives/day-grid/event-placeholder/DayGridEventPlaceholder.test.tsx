import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<DayGrid.EventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<DayGrid.EventPlaceholder />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <DayGrid.Root>
            <DayGrid.Row start={eventStart} end={eventEnd}>
              <DayGrid.Cell value={eventStart}>{node}</DayGrid.Cell>
            </DayGrid.Row>
          </DayGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
