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

  // `clip-path` clips the outline away with everything else outside the chevron, so the chevron is
  // dropped while focused or a continuing event takes focus showing no ring at all.
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

      const styles = window.getComputedStyle(clipped!);
      expect(styles.clipPath, 'the chevron still clips the ring away').to.equal('none');
      expect(styles.outlineStyle).to.equal('solid');
    },
  );

  it.skipIf(isJSDOM)('should show a pointer cursor on every event in the popover', async () => {
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

    // The all-day event renders with the `filled` variant, which used to miss the pointer the
    // other variants and the day grid event all have.
    const cards = Array.from(popover.querySelectorAll<HTMLElement>('[data-variant]'));
    expect(cards.length).to.be.greaterThan(0);
    cards.forEach((card) => {
      expect(window.getComputedStyle(card).cursor, `variant ${card.dataset.variant}`).to.equal(
        'pointer',
      );
    });
  });
});
