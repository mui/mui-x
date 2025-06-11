import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimeGrid.Column />', () => {
  const { render } = createSchedulerRenderer();

  const day = DateTime.now();

  describeConformance(<TimeGrid.Column key="day-1" value={day} />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<TimeGrid.Root>{node}</TimeGrid.Root>);
    },
  }));
});
