import * as React from 'react';
import { screen, within } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

const resource = ResourceBuilder.new().title('Resource').build();
const event = EventBuilder.new()
  .title('Meeting')
  .resource(resource)
  .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
  .build();

const roots: [string, React.ElementType][] = [
  ['EventCalendar', EventCalendar],
  ['EventCalendarPremium', EventCalendarPremium],
  ['StandaloneWeekView', StandaloneWeekView],
  ['EventTimelinePremium', EventTimelinePremium],
];

describe('Scheduler roots - text direction', () => {
  const { renderSettled } = createSchedulerRenderer();

  // The color picker is a Base UI ToggleGroup, which reads the direction from the root.
  describe.each(roots)('<%s />', (_, Root) => {
    it('should mirror the arrow keys of the Base UI components in RTL', async () => {
      const { user } = await renderSettled(
        <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
          <div dir="rtl" style={{ width: 1200, height: 600 }}>
            <Root
              events={[event]}
              resources={[resource]}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            />
          </div>
        </ThemeProvider>,
      );

      await user.click(screen.getByRole('button', { name: /^Meeting,/ }));
      const dialog = await screen.findByRole('dialog');
      const colorGroup = within(dialog).getByRole('group', { name: 'Event color' });
      const colors = within(colorGroup).getAllByRole('button');

      await user.click(colors[0]);
      await user.keyboard('{ArrowLeft}');

      // In LTR, ArrowLeft from the first color loops to the last one.
      expect(colors[1]).toHaveFocus();
    });
  });
});
