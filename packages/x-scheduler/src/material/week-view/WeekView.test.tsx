import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';

describe('<WeekView />', () => {
  const { render } = createSchedulerRenderer();
  const adapter = getAdapter();

  describe('time navigation', () => {
    it('should go to start of previous week when clicking on the Previous Week button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="week"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous week/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(visibleDate), -1),
      );
    });

    it('should go to start of next week when clicking on the Next Week button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z'); // Thursday

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="week"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next week/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(visibleDate), 1),
      );
    });
  });
});
