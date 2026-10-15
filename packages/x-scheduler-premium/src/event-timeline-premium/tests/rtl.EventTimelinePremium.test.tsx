import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

// Reads the laid out styles, so this only runs in the browser.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should place the events from the inline start of the time axis', async () => {
    const resource = ResourceBuilder.new().title('Resource').build();
    const early = EventBuilder.new()
      .title('Early')
      .resource(resource)
      .span('2025-07-03T00:00:00', '2025-07-03T02:00:00')
      .build();
    const late = EventBuilder.new()
      .title('Late')
      .resource(resource)
      .span('2025-07-03T02:00:00', '2025-07-03T04:00:00')
      .build();

    await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 300 }}>
          <EventTimelinePremium
            resources={[resource]}
            events={[early, late]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
          />
        </div>
      </ThemeProvider>,
    );

    const titleRect = document
      .querySelector<HTMLElement>(`.${classes.titleCell}`)!
      .getBoundingClientRect();
    const [earlyRect, lateRect] = Array.from(
      document.querySelectorAll<HTMLElement>(`.${classes.event}`),
    ).map((element) => element.getBoundingClientRect());
    // The axis starts next to the title column, on the right, and goes leftwards.
    expect(earlyRect.right).to.be.closeTo(titleRect.left, 1);
    expect(lateRect.right).to.be.closeTo(earlyRect.left, 1);
  });
});
