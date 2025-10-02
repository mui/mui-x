import * as React from 'react';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { TimelineProvider } from '@mui/x-scheduler/primitives/timeline-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Root items={[]} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<TimelineProvider events={[]}>{node}</TimelineProvider>);
    },
  }));
});
