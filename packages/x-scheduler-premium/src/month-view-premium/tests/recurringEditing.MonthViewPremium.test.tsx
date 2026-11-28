import * as React from 'react';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
} from 'test/utils/scheduler';
import { StandaloneMonthViewPremium } from '@mui/x-scheduler-premium/month-view-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import { describe, it, expect, beforeEach } from 'vitest';

const features = { recurringEvents: recurringEventsFeature };

describe('MonthViewPremium - recurring event editing', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  beforeEach(() => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
  });

  const initialEvent = EventBuilder.new()
    .id('event-1')
    .title('Daily Standup')
    .recurrent('DAILY')
    .build();

  function StatefulMonthView() {
    const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
    return (
      <StandaloneMonthViewPremium
        features={features}
        events={events}
        onEventsChange={setEvents}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />
    );
  }

  it.each(['Only this event', 'This and following events'])(
    'should move focus to the cell of the event once an edit with "%s" moves it out of the series',
    async (scope) => {
      const { user } = render(<StatefulMonthView />);
      const event = screen.getAllByRole('button', { name: /Daily Standup/i })[0];
      const cell = event.closest('[role="gridcell"]');

      act(() => {
        event.focus();
      });
      await user.keyboard('{Enter}');
      await user.type(screen.getByRole('textbox', { name: /Event title/i }), ' (moved)');
      await user.click(screen.getByRole('button', { name: 'Save' }));
      await user.click(screen.getByRole('radio', { name: scope }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(event.isConnected).to.equal(false);
      await waitFor(() => {
        expect(document.activeElement).to.equal(cell);
      });
    },
  );

  it('should move focus back to the event once an edit with "All events" closes the dialog', async () => {
    const { user } = render(<StatefulMonthView />);
    const event = screen.getAllByRole('button', { name: /Daily Standup/i })[0];

    act(() => {
      event.focus();
    });
    await user.keyboard('{Enter}');
    await user.type(screen.getByRole('textbox', { name: /Event title/i }), ' (renamed)');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('radio', { name: 'All events' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(document.activeElement).to.equal(event);
    });
  });
});
