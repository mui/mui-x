import * as React from 'react';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<TimeGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<TimeGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<EventCalendarProvider events={[]}>{node}</EventCalendarProvider>);
    },
  }));
});
