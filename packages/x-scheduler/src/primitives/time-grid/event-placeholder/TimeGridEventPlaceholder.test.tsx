import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.EventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<TimeGrid.EventPlaceholder start={eventStart} end={eventEnd} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimeGrid.Root>
          <TimeGrid.Column start={eventStart} end={eventEnd}>
            {node}
          </TimeGrid.Column>
        </TimeGrid.Root>,
      );
    },
  }));
});
