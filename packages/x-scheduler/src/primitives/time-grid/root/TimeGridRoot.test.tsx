import * as React from 'react';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimeGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render,
  }));
});
