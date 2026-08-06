import * as React from 'react';
import { adapter, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { screen } from '@mui/internal-test-utils';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { MonthView } from '../../../../month-view';
import { EventCalendarProvider } from '../../EventCalendarProvider';
import { EventDialogProvider } from '../../event-dialog';

// Spans three days, so on the middle one it renders with a "continues before" chevron.
const CONTINUING_EVENT: SchedulerEvent = EventBuilder.new()
  .title('Conference')
  .span('2025-05-05T09:00:00Z', '2025-05-07T18:00:00Z')
  .build();

// Enough same-day events to push the cell into showing a "+N more" button.
const CROWDING_EVENTS: SchedulerEvent[] = Array.from({ length: 6 }, (_, index) =>
  EventBuilder.new()
    .title(`Filler ${index + 1}`)
    .singleDay(`2025-05-06T0${index + 1}:00:00Z`)
    .build(),
);

describe('<EventItem />', () => {
  const { render } = createSchedulerRenderer();

  // `clip-path` clips the outline away with everything else outside the chevron, so the focus ring
  // has to be painted inside the shape or a continuing event takes focus showing nothing at all.
  it.skipIf(isJSDOM)(
    'should paint a focus ring on an event continuing past the day edge',
    async () => {
      const { user } = render(
        <EventCalendarProvider
          events={[CONTINUING_EVENT, ...CROWDING_EVENTS]}
          resources={[]}
          visibleDate={adapter.date('2025-05-06T00:00:00Z', 'default')}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      await user.click(await screen.findByRole('button', { name: /more/i }));
      const popover = await screen.findByRole('presentation');

      const clipped = popover.querySelector<HTMLElement>('[data-starting-before-edge]');
      expect(clipped, 'no continuing event in the popover').not.to.equal(null);

      // A keyboard interaction first, so the programmatic focus below matches `:focus-visible`.
      await user.keyboard('{Tab}');
      clipped!.focus();
      expect(clipped!.matches(':focus-visible'), 'element is not :focus-visible').to.equal(true);

      expect(window.getComputedStyle(clipped!).boxShadow).not.to.equal('none');
    },
  );
});
