import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<TimeGrid.Event start={eventStart} end={eventEnd} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimeGrid.Root>
          <TimeGrid.Column value={eventStart}>{node}</TimeGrid.Column>
        </TimeGrid.Root>,
      );
    },
  }));
});
