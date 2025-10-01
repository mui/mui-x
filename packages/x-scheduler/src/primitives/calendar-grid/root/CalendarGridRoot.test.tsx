import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler/primitives/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<CalendarGrid.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<CalendarGrid.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<EventCalendarProvider events={[]}>{node}</EventCalendarProvider>);
    },
  }));
});
