import * as React from 'react';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Cell />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<DayGrid.Cell />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <DayGrid.Root>
          <DayGrid.Row>{node}</DayGrid.Row>
        </DayGrid.Root>,
      );
    },
  }));
});
