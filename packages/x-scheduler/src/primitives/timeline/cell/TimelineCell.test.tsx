import * as React from 'react';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <Timeline.Root items={[]}>
          <Timeline.Row>{node}</Timeline.Row>
        </Timeline.Root>,
      );
    },
  }));
});
