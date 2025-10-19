import * as React from 'react';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.EventRow />', () => {
  const { render } = createSchedulerRenderer();

  const start = adapter.startOfDay(adapter.date());
  const end = adapter.endOfDay(adapter.date());

  describeConformance(<Timeline.EventRow start={start} end={end} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root items={[]}>{node}</Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
