import { act, screen, waitFor, within } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  EventTimelinePremium,
  eventTimelinePremiumClasses as classes,
} from '@mui/x-scheduler-premium/event-timeline-premium';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

// The tip of the chevron sits on the left edge (`0px 50%`) or on the right edge (`100% 50%`).
const LEFT_TIP = '0px 50%';
const RIGHT_TIP = '100% 50%';

// 4 days × 4 visible hours fit in the host, so every event is mounted without scrolling.
const PRESET_CONFIG = { dayAndHour: { startTime: 8, endTime: 12 } };

const resource = ResourceBuilder.new().title('Resource').build();

describe('<EventTimelinePremium /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date('2025-07-03T09:00:00'),
  });

  it('should mirror the arrow keys of the Base UI components', async () => {
    const event = EventBuilder.new()
      .title('Meeting')
      .resource(resource)
      .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
      .build();

    const { user } = await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 600 }}>
          <EventTimelinePremium
            events={[event]}
            resources={[resource]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          />
        </div>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /^Meeting,/ }));
    const dialog = await screen.findByRole('dialog');
    // The color picker is a Base UI ToggleGroup, which reads the direction from the root.
    const colorGroup = within(dialog).getByRole('group', { name: 'Event color' });
    const colors = within(colorGroup).getAllByRole('button');

    await user.click(colors[0]);
    await user.keyboard('{ArrowLeft}');

    // In LTR, ArrowLeft from the first color loops to the last one.
    expect(colors[1]).toHaveFocus();
  });

  // The virtualizer reads the scroll position and the layout, so this only runs in the browser.
  it.skipIf(isJSDOM)('should virtualize the columns from the RTL scroll position', async () => {
    // On the last day of the `dayAndHour` axis, so it's virtualized out before scrolling.
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

    expect(screen.getByText('Resource')).not.to.equal(null);
    expect(document.querySelector(`.${classes.event}`)).to.equal(null);

    // In RTL, `scrollLeft` goes from 0 down to negative values.
    const scroller = screen.getByRole('grid');
    act(() => {
      scroller.scrollLeft = -scroller.scrollWidth;
    });

    await absorbObserverFrames();

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

  // Reads the laid out styles, so this only runs in the browser.
  describe.skipIf(isJSDOM).each([
    ['ltr', { endTip: RIGHT_TIP, startTip: LEFT_TIP }],
    ['rtl', { endTip: LEFT_TIP, startTip: RIGHT_TIP }],
  ] as const)('%s', (direction, { endTip, startTip }) => {
    async function renderTimeline(events: SchedulerEvent[]) {
      await renderSettled(
        <ThemeProvider theme={createTheme({ direction })}>
          <div dir={direction} style={{ width: 1200, height: 300 }}>
            <EventTimelinePremium
              resources={[resource]}
              events={events}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
              preset="dayAndHour"
              presets={['dayAndHour']}
              presetConfig={PRESET_CONFIG}
            />
          </div>
        </ThemeProvider>,
      );

      const titleCell = document.querySelector<HTMLElement>(`.${classes.titleCell}`)!;
      await waitFor(() => {
        expect(titleCell.getBoundingClientRect().width).to.be.greaterThan(0);
      });
    }

    const getInlineStart = (rect: DOMRect) => (direction === 'rtl' ? rect.right : rect.left);
    const getInlineEnd = (rect: DOMRect) => (direction === 'rtl' ? rect.left : rect.right);

    const getEvent = (title: string) =>
      screen.getByText(title).closest<HTMLElement>(`.${classes.event}`)!;

    const getFirstHourCellRect = () =>
      document
        .querySelector<HTMLElement>(`.${classes.headerCell}[data-unit="hour"]`)!
        .getBoundingClientRect();

    it('should place the events from the inline start of the time axis', async () => {
      await renderTimeline([
        EventBuilder.new()
          .title('Early')
          .resource(resource)
          .span('2025-07-03T08:00:00', '2025-07-03T09:00:00')
          .build(),
        EventBuilder.new()
          .title('Late')
          .resource(resource)
          .span('2025-07-03T09:00:00', '2025-07-03T10:00:00')
          .build(),
      ]);

      const earlyRect = getEvent('Early').getBoundingClientRect();
      const lateRect = getEvent('Late').getBoundingClientRect();
      expect(getInlineStart(earlyRect)).to.be.closeTo(getInlineStart(getFirstHourCellRect()), 1);
      expect(getInlineStart(lateRect)).to.be.closeTo(getInlineEnd(earlyRect), 1);
    });

    it('should place the current time indicator at its time on the axis', async () => {
      // The clock is at 09:00, when this event starts.
      await renderTimeline([
        EventBuilder.new()
          .title('Now')
          .resource(resource)
          .span('2025-07-03T09:00:00', '2025-07-03T10:00:00')
          .build(),
      ]);

      const indicator = document.querySelector<HTMLElement>(`.${classes.currentTimeIndicator}`)!;
      expect(getInlineStart(indicator.getBoundingClientRect())).to.be.closeTo(
        getInlineStart(getEvent('Now').getBoundingClientRect()),
        2,
      );
    });

    it('should place the start resize handler on the inline start of the event', async () => {
      await renderTimeline([
        EventBuilder.new()
          .title('Meeting')
          .resource(resource)
          .span('2025-07-03T09:00:00', '2025-07-03T10:00:00')
          .build(),
      ]);

      const event = getEvent('Meeting');
      const startHandler = event.querySelector<HTMLElement>(
        `.${classes.eventResizeHandler}[data-start]`,
      );
      expect(startHandler).not.to.equal(null);
      expect(getInlineStart(startHandler!.getBoundingClientRect())).to.be.closeTo(
        getInlineStart(event.getBoundingClientRect()),
        1,
      );
    });

    it('should cut the chevron of an event starting before the axis on its inline start', async () => {
      await renderTimeline([
        EventBuilder.new()
          .title('Overnight')
          .resource(resource)
          .span('2025-07-02T20:00:00', '2025-07-03T10:00:00')
          .build(),
      ]);

      const event = getEvent('Overnight');
      expect(getComputedStyle(event).clipPath).to.contain(startTip);
      expect(getComputedStyle(event).clipPath).not.to.contain(endTip);
      expect(getComputedStyle(event, '::before').display).to.equal('none');
    });

    it('should cut the chevron of an event ending after the axis on its inline end', async () => {
      await renderTimeline([
        EventBuilder.new()
          .title('Late shift')
          .resource(resource)
          .span('2025-07-06T10:00:00', '2025-07-07T02:00:00')
          .build(),
      ]);

      const event = getEvent('Late shift');
      expect(getComputedStyle(event).clipPath).to.contain(endTip);
      expect(getComputedStyle(event).clipPath).not.to.contain(startTip);
    });
  });
});
