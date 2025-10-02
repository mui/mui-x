import * as React from 'react';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
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
        <TimelineProvider events={[]}>
          <Timeline.Root items={[]}>
            <Timeline.EventRow start={start} end={end}>
              <Timeline.Event start={start} end={end}>
                {node}
              </Timeline.Event>
            </Timeline.EventRow>
          </Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
