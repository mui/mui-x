import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  createSchedulerRenderer,
  EventBuilder,
  expectBoxSizingIndependentLayout,
} from 'test/utils/scheduler';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import { describe, it } from 'vitest';

const features = { recurringEvents: recurringEventsFeature };

/**
 * Apps with and without a global `border-box` reset must see the same layout.
 * Each test renders one surface in the state that reaches its size constraints.
 */
describe.skipIf(isJSDOM)('EventCalendarPremium - box-sizing', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03Z') });

  // Every second week is not a preset, so the dialog shows the custom weekly day selector.
  const events = [
    EventBuilder.new()
      .title('Planning')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .rrule({ freq: 'WEEKLY', interval: 2, byDay: ['MO', 'TH'] })
      .build(),
  ];

  it('should render a recurring event and its recurrence tab the same', async () => {
    const { user } = await renderSettled(
      <div style={{ height: 700 }}>
        <EventCalendarPremium
          events={events}
          resources={[]}
          features={features}
          defaultView="week"
        />
      </div>,
    );
    expectBoxSizingIndependentLayout();

    await user.click(screen.getByRole('button', { name: /Planning/ }));
    await user.click(await screen.findByRole('tab', { name: /recurrence/i }));
    expectBoxSizingIndependentLayout();
  });
});
