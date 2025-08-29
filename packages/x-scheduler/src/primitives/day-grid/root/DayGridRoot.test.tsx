import * as React from 'react';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<DayGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render,
  }));
});
