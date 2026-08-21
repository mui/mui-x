import * as React from 'react';
import { adapter, createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { screen } from '@mui/internal-test-utils';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { MonthView } from '../../../../month-view';
import { EventCalendarProvider } from '../../EventCalendarProvider';
import { EventDialogProvider } from '../../event-dialog';

// One chevron each on the displayed day, so a test can pick an occurrence clipped on a single side.
const startsBeforeEvent: SchedulerEvent = EventBuilder.new()
  .title('Conference')
  .span('2025-05-05T09:00:00Z', '2025-05-06T18:00:00Z')
  .build();

const endsAfterEvent: SchedulerEvent = EventBuilder.new()
  .title('Workshop')
  .span('2025-05-06T09:00:00Z', '2025-05-07T18:00:00Z')
  .build();

// Enough same-day events to push the cell into showing a "+N more" button.
const crowdingEvents: SchedulerEvent[] = Array.from({ length: 6 }, (_, index) =>
  EventBuilder.new()
    .title(`Filler ${index + 1}`)
    .singleDay(`2025-05-06T0${index + 1}:00:00Z`)
    .build(),
);

describe('<EventItem />', () => {
  const { render } = createSchedulerRenderer();

  async function renderAndOpenPopover() {
    const { user } = render(
      <EventCalendarProvider
        events={[startsBeforeEvent, endsAfterEvent, ...crowdingEvents]}
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
    return { user, popover };
  }

  // The chevron `clip-path` also clips the focus outline away, so it is dropped while focused.
  // One case per edge, since each edge has its own selector.
  const clippedEdges = [
    { edge: 'starting before the day', selector: '[data-starting-before-edge]' },
    { edge: 'ending after the day', selector: '[data-ending-after-edge]' },
  ] as const;

  clippedEdges.forEach(({ edge, selector }, index) => {
    const otherSelector = clippedEdges[1 - index].selector;

    it.skipIf(isJSDOM)(`should paint a focus ring on an event ${edge}`, async () => {
      const { user, popover } = await renderAndOpenPopover();

      // Only the one chevron, or the other edge's rule could be what drops the clip.
      const clipped = popover.querySelector<HTMLElement>(`${selector}:not(${otherSelector})`);
      expect(clipped, `no event ${edge} in the popover`).not.to.equal(null);

      // A keyboard interaction first, so the programmatic focus below matches `:focus-visible`.
      await user.keyboard('{Tab}');
      clipped!.focus();
      expect(clipped!.matches(':focus-visible'), 'element is not :focus-visible').to.equal(true);

      const styles = window.getComputedStyle(clipped!);
      expect(styles.clipPath, 'the chevron still clips the ring away').to.equal('none');
      expect(styles.outlineStyle).to.equal('solid');
    });
  });

  it.skipIf(isJSDOM)('should show a pointer cursor on every event in the popover', async () => {
    const { popover } = await renderAndOpenPopover();

    // The `filled` variant is the one that regressed, so make sure the loop covers it.
    const filled = popover.querySelectorAll<HTMLElement>('[data-variant="filled"]');
    expect(filled.length, 'no filled event in the popover').to.be.greaterThan(0);

    const cards = popover.querySelectorAll<HTMLElement>('[data-variant]');
    cards.forEach((card) => {
      expect(window.getComputedStyle(card).cursor, `variant ${card.dataset.variant}`).to.equal(
        'pointer',
      );
    });
  });
});
