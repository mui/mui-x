import * as React from 'react';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Row />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Row />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Timeline.Root items={[]}>{node}</Timeline.Root>);
    },
  }));
});
