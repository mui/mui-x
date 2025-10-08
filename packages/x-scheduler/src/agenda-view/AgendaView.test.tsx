import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { DateTime } from 'luxon';
import { spy } from 'sinon';
import { adapter, createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

describe('<AgendaView />', () => {
  const { render } = createSchedulerRenderer();

  describe('time navigation', () => {
    it('should go to previous agenda period (12 days) when clicking on the Previous Agenda button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous agenda/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, -12),
      );
    });

    it('should go to next agenda period (12 days) when clicking on the Next Agenda button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = DateTime.fromISO('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next agenda/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, 12),
      );
    });
  });
});
