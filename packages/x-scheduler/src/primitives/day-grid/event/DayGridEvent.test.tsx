import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<DayGrid.Event start={eventStart} end={eventEnd} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <DayGrid.Root>
          <DayGrid.Row key="week-1">
            <DayGrid.Cell key="day-1">
              <DayGrid.Event start={eventStart} end={eventEnd}>
                {node}
              </DayGrid.Event>
            </DayGrid.Cell>
          </DayGrid.Row>
        </DayGrid.Root>,
      );
    },
  }));
});
