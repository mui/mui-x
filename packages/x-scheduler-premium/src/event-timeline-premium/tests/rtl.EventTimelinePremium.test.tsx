import { act, screen, waitFor } from '@mui/internal-test-utils';
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

// The virtualizer reads the scroll position and the layout, so this only runs in the browser.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it('should render the columns in view after scrolling to the end of the time axis', async () => {
    const resource = ResourceBuilder.new().title('Resource').build();
    // On the last visible day, so it's virtualized out before scrolling.
    const lateEvent = EventBuilder.new()
      .title('Late')
      .resource(resource)
      .span('2025-07-06T14:00:00', '2025-07-06T20:00:00')
      .build();

    await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 300 }}>
          <EventTimelinePremium
            resources={[resource]}
            events={[lateEvent]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
          />
        </div>
      </ThemeProvider>,
    );

    expect(document.querySelector(`.${classes.event}`)).to.equal(null);

    // In RTL, `scrollLeft` goes from 0 down to negative values.
    const scroller = screen.getByRole('grid');
    act(() => {
      scroller.scrollLeft = -scroller.scrollWidth;
    });

    await waitFor(() => {
      expect(document.querySelector(`.${classes.event}`)).not.to.equal(null);
    });

    // The title column stays pinned at the inline start (the right edge).
    const titleCell = document.querySelector<HTMLElement>(`.${classes.titleCell}`)!;
    expect(titleCell.getBoundingClientRect().right).to.be.closeTo(
      scroller.getBoundingClientRect().right,
      1,
    );
  });
});
