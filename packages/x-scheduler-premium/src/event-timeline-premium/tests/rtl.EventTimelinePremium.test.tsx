import { screen, waitFor } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

const resource = ResourceBuilder.new().title('Resource').build();

// Reads the laid out styles, so this only runs in the browser.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  async function setUpRtlTimeline(events: SchedulerEvent[]) {
    await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 300 }}>
          <EventTimelinePremium
            resources={[resource]}
            events={events}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
          />
        </div>
      </ThemeProvider>,
    );

    const titleCell = document.querySelector<HTMLElement>(`.${classes.titleCell}`)!;
    await waitFor(() => {
      expect(titleCell.getBoundingClientRect().width).to.be.greaterThan(0);
    });
    return titleCell;
  }

  const getEvent = (title: string) =>
    screen.getByText(title).closest<HTMLElement>(`.${classes.event}`)!;

  it('should place the events from the inline start of the time axis', async () => {
    const titleCell = await setUpRtlTimeline([
      EventBuilder.new()
        .title('Early')
        .resource(resource)
        .span('2025-07-03T00:00:00', '2025-07-03T02:00:00')
        .build(),
      EventBuilder.new()
        .title('Late')
        .resource(resource)
        .span('2025-07-03T02:00:00', '2025-07-03T04:00:00')
        .build(),
    ]);

    const titleRect = titleCell.getBoundingClientRect();
    const earlyRect = getEvent('Early').getBoundingClientRect();
    const lateRect = getEvent('Late').getBoundingClientRect();
    // The axis starts next to the title column, on the right, and goes leftwards.
    expect(earlyRect.right).to.be.closeTo(titleRect.left, 1);
    expect(lateRect.right).to.be.closeTo(earlyRect.left, 1);
  });

  it('should cut the chevron of an event starting before the axis on its inline start', async () => {
    await setUpRtlTimeline([
      EventBuilder.new()
        .title('Overnight')
        .resource(resource)
        .span('2025-07-02T20:00:00', '2025-07-03T02:00:00')
        .build(),
    ]);

    const event = getEvent('Overnight');
    // The inline start is on the right, so the tip of the chevron is on the right edge.
    expect(getComputedStyle(event).clipPath).to.contain('100% 50%');
    expect(getComputedStyle(event).clipPath).not.to.contain('0px 50%');
    expect(getComputedStyle(event, '::before').display).to.equal('none');
  });
});
