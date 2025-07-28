import * as React from 'react';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { DateTime } from 'luxon';

describe('<Timeline.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = DateTime.now().startOf('day');
  const end = DateTime.now().endOf('day');

  describeConformance(<Timeline.Event start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <Timeline.Root items={[]}>
          <Timeline.Event start={start} end={end}>
            {node}
          </Timeline.Event>
        </Timeline.Root>,
      );
    },
  }));
});
