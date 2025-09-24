import * as React from 'react';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<DayGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<DayGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<EventCalendarProvider events={[]}>{node}</EventCalendarProvider>);
    },
  }));
});
