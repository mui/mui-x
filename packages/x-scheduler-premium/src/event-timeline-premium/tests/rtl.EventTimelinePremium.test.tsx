import { act, fireEvent, screen, waitFor, within } from '@mui/internal-test-utils';
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
  getEventNamePattern,
  getResizeHandle,
  mockElementBounds,
  ResourceBuilder,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { getEventRow, mockAllEventRowBounds } from './dependencyTestUtils';

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

  // The rows are mocked, so the pointer math runs in jsdom.
  describe.each(['ltr', 'rtl'] as const)('%s pointer interactions', (direction) => {
    // dayAndHour trimmed to 8:00 → 20:00: 4 days × 720 visible minutes = 2880 axis
    // minutes. Rows are mocked at 2880px so 1px = 1 axis minute.
    const AXIS_WIDTH = 2880;
    const TRIMMED_PRESET_CONFIG = { dayAndHour: { startTime: 8, endTime: 20 } };

    // The time axis starts on the right in RTL.
    const getClientX = (axisMinute: number) =>
      direction === 'rtl' ? AXIS_WIDTH - axisMinute : axisMinute;

    async function renderTimeline(events: SchedulerEvent[], onEventsChange?: () => void) {
      await renderSettled(
        <ThemeProvider theme={createTheme({ direction })}>
          <div dir={direction}>
            <EventTimelinePremium
              resources={[resource]}
              events={events}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
              preset="dayAndHour"
              presets={['dayAndHour']}
              presetConfig={TRIMMED_PRESET_CONFIG}
              onEventsChange={onEventsChange}
            />
          </div>
        </ThemeProvider>,
      );
      mockAllEventRowBounds(AXIS_WIDTH);
    }

    // 10:00 → 11:00 on July 3 covers the axis minutes 120 → 180.
    async function renderMeeting() {
      const onEventsChange = vi.fn();
      await renderTimeline(
        [
          EventBuilder.new()
            .title('Meeting')
            .resource(resource)
            .singleDay('2025-07-03T10:00:00Z', 60)
            .build(),
        ],
        onEventsChange,
      );
      // Mocked from the rendered position, so a render↔drag mismatch can't slip through.
      const event = screen.getByText('Meeting').closest<HTMLElement>(`.${classes.event}`)!;
      const start = (parseFloat(event.style.getPropertyValue('--x-position')) / 100) * AXIS_WIDTH;
      const width = (parseFloat(event.style.getPropertyValue('--width')) / 100) * AXIS_WIDTH;
      expect(start).to.be.closeTo(120, 0.001);
      mockElementBounds(event, {
        left: direction === 'rtl' ? AXIS_WIDTH - start - width : start,
        width,
        height: 30,
      });
      return { event, onEventsChange };
    }

    it('should move an event by the dragged distance', async () => {
      const { event, onEventsChange } = await renderMeeting();

      // Grab 10 minutes into the event and drop at axis minute 850: the event starts at
      // axis minute 840 = one visible day (720) + 120 → July 4, 10:00.
      await act(async () => {
        simulateDragAndDrop({
          source: event,
          target: getEventRow(resource.id),
          sourceClientX: getClientX(130),
          targetClientX: getClientX(850),
        });
      });

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(new Date(onEventsChange.mock.calls[0][0][0].start).toISOString()).to.equal(
        '2025-07-04T10:00:00.000Z',
      );
      expect(new Date(onEventsChange.mock.calls[0][0][0].end).toISOString()).to.equal(
        '2025-07-04T11:00:00.000Z',
      );
    });

    it('should resize the start of an event to the pointer', async () => {
      const { event, onEventsChange } = await renderMeeting();

      await act(async () => {
        simulateDragAndDrop({
          source: getResizeHandle(event, 'start'),
          target: getEventRow(resource.id),
          sourceClientX: getClientX(120),
          targetClientX: getClientX(60),
        });
      });

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(new Date(onEventsChange.mock.calls[0][0][0].start).toISOString()).to.equal(
        '2025-07-03T09:00:00.000Z',
      );
      expect(new Date(onEventsChange.mock.calls[0][0][0].end).toISOString()).to.equal(
        '2025-07-03T11:00:00.000Z',
      );
    });

    it('should resize the end of an event to the pointer', async () => {
      const { event, onEventsChange } = await renderMeeting();

      await act(async () => {
        simulateDragAndDrop({
          source: getResizeHandle(event, 'end'),
          target: getEventRow(resource.id),
          sourceClientX: getClientX(180),
          targetClientX: getClientX(300),
        });
      });

      expect(onEventsChange.mock.calls.length).to.equal(1);
      expect(new Date(onEventsChange.mock.calls[0][0][0].start).toISOString()).to.equal(
        '2025-07-03T10:00:00.000Z',
      );
      expect(new Date(onEventsChange.mock.calls[0][0][0].end).toISOString()).to.equal(
        '2025-07-03T13:00:00.000Z',
      );
    });

    it('should create an event at the clicked time', async () => {
      await renderTimeline([]);

      fireEvent.click(getEventRow(resource.id), { clientX: getClientX(120) });

      // 10:00 on July 3 is axis minute 120.
      const placeholder = document.querySelector<HTMLElement>(`.${classes.eventPlaceholder}`);
      expect(placeholder).not.to.equal(null);
      expect(parseFloat(placeholder!.style.getPropertyValue('--x-position'))).to.be.closeTo(
        (120 / AXIS_WIDTH) * 100,
        0.001,
      );
    });
  });

  // Reads `clientWidth` and `scrollLeft`, so this only runs in the browser.
  it.skipIf(isJSDOM)(
    'should scroll virtualized-out events into view on Tab and Shift+Tab',
    async () => {
      const eventAt = (title: string, start: string) =>
        EventBuilder.new().title(title).resource(resource).singleDay(start, 30).build();

      const { user } = await renderSettled(
        <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
          <div dir="rtl" style={{ width: 1200, height: 300 }}>
            <EventTimelinePremium
              resources={[resource]}
              events={[
                eventAt('First', '2025-07-03T01:00:00Z'),
                // About 18 hours fit in the viewport, so this one is virtualized out.
                eventAt('Second', '2025-07-04T04:00:00Z'),
              ]}
              visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
              preset="dayAndHour"
              presets={['dayAndHour']}
            />
          </div>
        </ThemeProvider>,
      );

      await waitFor(() => {
        expect(screen.queryByLabelText(getEventNamePattern('First'))).not.to.equal(null);
      });
      expect(screen.queryByLabelText(getEventNamePattern('Second'))).to.equal(null);

      act(() => {
        screen.getByLabelText(getEventNamePattern('First')).focus();
      });
      await user.keyboard('{Tab}');

      await waitFor(() => {
        expect(screen.getByLabelText(getEventNamePattern('Second'))).toHaveFocus();
      });
      // The events area is on the left of the title column, which stays pinned on the right.
      const scroller = screen.getByRole('grid');
      const titleCell = document.querySelector<HTMLElement>(`.${classes.titleCell}`)!;
      const second = screen.getByLabelText(getEventNamePattern('Second')).getBoundingClientRect();
      expect(second.left).to.be.greaterThanOrEqual(scroller.getBoundingClientRect().left);
      expect(second.right).to.be.lessThanOrEqual(titleCell.getBoundingClientRect().left);
      expect(scroller.scrollLeft).to.be.lessThan(0);

      // Back from a scrolled position, toward the inline start.
      await user.keyboard('{Shift>}{Tab}{/Shift}');

      await waitFor(() => {
        expect(screen.getByLabelText(getEventNamePattern('First'))).toHaveFocus();
      });
      const first = screen.getByLabelText(getEventNamePattern('First')).getBoundingClientRect();
      expect(first.right).to.be.lessThanOrEqual(titleCell.getBoundingClientRect().left);
      expect(first.left).to.be.greaterThanOrEqual(scroller.getBoundingClientRect().left);
    },
  );
});
