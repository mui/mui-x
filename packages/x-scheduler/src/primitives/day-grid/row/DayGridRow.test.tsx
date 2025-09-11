import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Row />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<DayGrid.Row start={day.startOf('day')} end={day.endOf('day')} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<DayGrid.Root>{node}</DayGrid.Root>);
    },
  }));
});
