import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';

describe('<DayView />', () => {
  const { render } = createSchedulerRenderer();
  const adapter = getAdapter();

  describe('time navigation', () => {
    it('should go to start of previous day when clicking on the Previous Day button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, -1),
      );
    });

    it('should go to start of next day when clicking on the Next Day button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, 1),
      );
    });
  });
});
