import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
} from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

describe('<DayView />', () => {
  const { render } = createSchedulerRenderer();

  describe('time navigation', () => {
    const visibleDate = adapter.date(DEFAULT_TESTING_VISIBLE_DATE);

    it('should go to start of previous day when clicking on the Previous Day button', async () => {
      const onVisibleDateChange = spy();

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
