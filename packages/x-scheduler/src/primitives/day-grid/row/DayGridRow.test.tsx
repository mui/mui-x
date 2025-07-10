import * as React from 'react';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Row />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<DayGrid.Row />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<DayGrid.Root>{node}</DayGrid.Root>);
    },
  }));
});
