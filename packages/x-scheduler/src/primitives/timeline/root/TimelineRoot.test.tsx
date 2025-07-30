import * as React from 'react';
import { Timeline } from '@mui/x-scheduler/primitives/timeline';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Root items={[]} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render,
  }));
});
