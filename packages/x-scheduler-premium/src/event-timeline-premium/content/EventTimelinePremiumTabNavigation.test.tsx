import * as React from 'react';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { isJSDOM } from 'test/utils/skipIf';

// Tab between events only works on top of real layout (the handler reads
// `clientWidth`/`scrollLeft` and the virtualizer only mounts a subset of events
// when the scroller has real dimensions). jsdom doesn't lay out, so skip there.
describe.skipIf(isJSDOM)('<EventTimelinePremium /> Tab navigation', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  const resource = ResourceBuilder.new().title('R').build();

  function eventAt(day: number, hour: number): SchedulerEvent {
    const hh = String(hour).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return EventBuilder.new()
      .title(`evt-d${day}-h${hour}`)
      .singleDay(`2025-07-${dd}T${hh}:00:00Z`, 30)
      .resource(resource)
      .build();
  }

  // Spread events across the 4-day `dayAndHour` window. With viewport ~1200px
  // and tickWidth=64, only the first ~18 hours fit, so events past hour ~18 on
  // day 3 (and everything on later days) are virtualized out at scrollLeft=0.
  const events = [
    eventAt(3, 1),
    eventAt(3, 5),
    eventAt(3, 10),
    eventAt(4, 4),
    eventAt(4, 20),
    eventAt(5, 10),
    eventAt(6, 20),
  ];

  function renderTimeline() {
    return render(
      <div style={{ width: 1200, height: 600 }}>
        <EventTimelinePremium
          resources={[resource]}
          events={events}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndHour"
          presets={['dayAndHour']}
        />
      </div>,
    );
  }

  function getEvent(title: string): HTMLElement | null {
    return screen.queryByLabelText(title);
  }

  function getScroller(): HTMLElement {
    return screen.getByRole('grid');
  }

  it('should focus the next event in row order when Tab is pressed', async () => {
    const { user } = renderTimeline();

    // Wait for the timeline to settle and confirm `evt-d3-h1` and `evt-d3-h5` are
    // both currently mounted (the close-together events near scrollLeft=0).
    await waitFor(() => {
      expect(getEvent('evt-d3-h1')).not.to.equal(null);
      expect(getEvent('evt-d3-h5')).not.to.equal(null);
    });

    act(() => {
      getEvent('evt-d3-h1')!.focus();
    });
    expect(document.activeElement).to.equal(getEvent('evt-d3-h1'));

    await user.keyboard('{Tab}');
    expect(document.activeElement).to.equal(getEvent('evt-d3-h5'));
  });

  it('should scroll-then-focus an event that is virtualized out', async () => {
    const { user } = renderTimeline();

    await waitFor(() => {
      expect(getEvent('evt-d3-h1')).not.to.equal(null);
    });

    // The last event (`evt-d6-h20`) is far past the visible viewport at
    // scrollLeft=0, so it must not be in the DOM yet.
    expect(getEvent('evt-d6-h20')).to.equal(null);

    // Focus a visible event and Tab forward enough times to cross past every
    // event that is currently mounted. Each Tab should scroll the virtualizer
    // and focus the next occurrence, even when that occurrence wasn't in the
    // DOM at the moment Tab was pressed.
    act(() => {
      getEvent('evt-d3-h1')!.focus();
    });

    const expectedOrder = [
      'evt-d3-h5',
      'evt-d3-h10',
      'evt-d4-h4',
      'evt-d4-h20',
      'evt-d5-h10',
      'evt-d6-h20',
    ];

    for (const title of expectedOrder) {
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{Tab}');
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {
        const next = getEvent(title);
        expect(next).not.to.equal(null);
        expect(document.activeElement).to.equal(next);
      });
    }

    // After the walk, the scroll position must be non-zero — we couldn't have
    // reached the day-6 event without scrolling.
    expect(getScroller().scrollLeft).to.be.greaterThan(0);
  });

  it('should walk back through events with Shift+Tab, including virtualized ones', async () => {
    const { user } = renderTimeline();

    // Scroll all the way right and confirm the last event mounts.
    await waitFor(() => {
      expect(getEvent('evt-d3-h1')).not.to.equal(null);
    });
    const scroller = getScroller();
    act(() => {
      scroller.scrollLeft = scroller.scrollWidth;
    });
    await waitFor(() => {
      expect(getEvent('evt-d6-h20')).not.to.equal(null);
    });
    act(() => {
      getEvent('evt-d6-h20')!.focus();
    });

    // Walk backward to the first event.
    const expectedOrder = [
      'evt-d5-h10',
      'evt-d4-h20',
      'evt-d4-h4',
      'evt-d3-h10',
      'evt-d3-h5',
      'evt-d3-h1',
    ];

    for (const title of expectedOrder) {
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {
        const prev = getEvent(title);
        expect(prev).not.to.equal(null);
        expect(document.activeElement).to.equal(prev);
      });
    }

    // After Shift+Tabbing back to the first event, the scroller is back near 0.
    expect(getScroller().scrollLeft).to.be.lessThan(200);
  });

  it('should let default Tab take focus out of the row past the last event', async () => {
    const { user } = renderTimeline();

    await waitFor(() => {
      expect(getEvent('evt-d3-h1')).not.to.equal(null);
    });

    // Scroll right so the last event mounts, then focus it.
    const scroller = getScroller();
    act(() => {
      scroller.scrollLeft = scroller.scrollWidth;
    });
    await waitFor(() => {
      expect(getEvent('evt-d6-h20')).not.to.equal(null);
    });
    act(() => {
      getEvent('evt-d6-h20')!.focus();
    });

    // Tab past the last event in the row: the interceptor returns false at the
    // boundary, so the browser default fires. The next focusable element after
    // the events cell is outside the events row (or outside the grid entirely).
    await user.keyboard('{Tab}');
    expect(document.activeElement).to.not.equal(getEvent('evt-d6-h20'));
  });
});
