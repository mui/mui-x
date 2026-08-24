import * as React from 'react';
import { act, screen, waitFor, within } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import type { EventTimelinePremiumPresetConfig } from '@mui/x-scheduler-internals-premium/models';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

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

  function renderTimeline(
    options: {
      events?: SchedulerEvent[];
      presetConfig?: EventTimelinePremiumPresetConfig;
      hostWidth?: number;
    } = {},
  ) {
    return render(
      <div style={{ width: options.hostWidth ?? 1200, height: 600 }}>
        <EventTimelinePremium
          resources={[resource]}
          events={options.events ?? events}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          preset="dayAndHour"
          presets={['dayAndHour']}
          presetConfig={options.presetConfig}
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

  describe('with a trimmed hour window', () => {
    // 8:00 → 20:00 leaves 12 ticks per day (768px), so the 4-day axis is 3072px wide.
    const TRIMMED = { dayAndHour: { startTime: 8, endTime: 20 } };

    it('should skip the occurrences hidden by the trimmed hour window instead of trapping focus', async () => {
      // 21:00 hides inside the window: its occurrence never mounts, so navigating to it
      // would swallow Tab forever.
      const { user } = renderTimeline({
        events: [eventAt(3, 10), eventAt(3, 21), eventAt(4, 10)],
        presetConfig: TRIMMED,
      });

      await waitFor(() => {
        expect(getEvent('evt-d3-h10')).not.to.equal(null);
      });
      expect(getEvent('evt-d3-h21')).to.equal(null);

      act(() => {
        getEvent('evt-d3-h10')!.focus();
      });

      await user.keyboard('{Tab}');
      await waitFor(() => {
        const next = getEvent('evt-d4-h10');
        expect(next).not.to.equal(null);
        expect(document.activeElement).to.equal(next);
      });
    });

    it('should scroll a virtualized-out target into view at its compressed-axis position', async () => {
      // The target sits on the last day at 19:00 — tick 47 of 48, around x=3008 — while
      // the 600px host shows roughly the first 540px. It cannot be reached without the
      // interceptor scrolling to the position the trimmed axis puts it at.
      const { user } = renderTimeline({
        events: [eventAt(3, 10), eventAt(3, 21), eventAt(6, 19)],
        presetConfig: TRIMMED,
        hostWidth: 600,
      });

      await waitFor(() => {
        expect(getEvent('evt-d3-h10')).not.to.equal(null);
      });
      // The premise of the test: the target starts virtualized out.
      expect(getEvent('evt-d6-h19')).to.equal(null);
      expect(getScroller().scrollLeft).to.equal(0);

      act(() => {
        getEvent('evt-d3-h10')!.focus();
      });

      await user.keyboard('{Tab}');

      await waitFor(() => {
        const target = getEvent('evt-d6-h19');
        expect(target).not.to.equal(null);
        expect(document.activeElement).to.equal(target);
      });

      // Scrolled to where the compressed axis puts the target, not merely far enough to
      // mount it: an offset derived from the untrimmed geometry lands elsewhere. The box
      // is checked by its start edge, since a short event renders wider than its slot to
      // fit the label.
      expect(getScroller().scrollLeft).to.be.greaterThan(0);
      const scrollerRect = getScroller().getBoundingClientRect();
      const targetRect = getEvent('evt-d6-h19')!.getBoundingClientRect();
      expect(targetRect.left).to.be.greaterThanOrEqual(scrollerRect.left);
      expect(targetRect.left).to.be.lessThan(scrollerRect.right);
    });
  });

  describe('multi-resource occurrences', () => {
    // Occurrence keys aren't unique across rows: a multi-resource event renders
    // one copy per assigned resource, all sharing the same `data-occurrence-key`.
    // Resolving the "next" DOM node for such a key must be scoped by row, or an
    // unscoped lookup can resolve to a same-key copy mounted in a different row.
    const resourceB = ResourceBuilder.new().title('B').build();
    const resourceA = ResourceBuilder.new().title('A').build();

    function getEventRow(resourceId: string): HTMLElement {
      const row = document.querySelector<HTMLElement>(
        `.MuiEventTimeline-eventsCell[data-resource-id="${resourceId}"]`,
      );
      if (!row) {
        throw new Error(`Could not find event row for resource "${resourceId}"`);
      }
      return row;
    }

    // `getByText` resolves to the innermost element with that text (a `<span>`
    // clamp, not focusable); walk up to the event root that actually carries
    // `data-occurrence-key`/`tabindex`.
    function getEventInRow(resourceId: string, title: string): HTMLElement {
      const textNode = within(getEventRow(resourceId)).getByText(title);
      const eventRoot = textNode.closest<HTMLElement>('[data-occurrence-key]');
      if (!eventRoot) {
        throw new Error(`Could not find the event root for "${title}" in row "${resourceId}"`);
      }
      return eventRoot;
    }

    it('should scope focus restoration by row when the target occurrence key is duplicated in another row', async () => {
      const soloInA = EventBuilder.new()
        .title('Solo A')
        .singleDay('2025-07-03T09:00:00Z', 30)
        .resource(resourceA)
        .build();
      const shared = EventBuilder.new()
        .title('Shared')
        .singleDay('2025-07-03T10:00:00Z', 30)
        .resources([resourceA, resourceB])
        .build();

      const { user } = render(
        <div style={{ width: 1200, height: 600 }}>
          <EventTimelinePremium
            // B listed before A so its (duplicate-keyed) copy of `shared` sits
            // earlier in DOM order than A's copy — an unscoped lookup for the
            // shared key would wrongly resolve to B's copy instead of A's.
            resources={[resourceB, resourceA]}
            events={[soloInA, shared]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            preset="dayAndHour"
            presets={['dayAndHour']}
          />
        </div>,
      );

      await waitFor(() => {
        expect(within(getEventRow(resourceA.id)).queryByText('Solo A')).not.to.equal(null);
        expect(within(getEventRow(resourceA.id)).queryByText('Shared')).not.to.equal(null);
        expect(within(getEventRow(resourceB.id)).queryByText('Shared')).not.to.equal(null);
      });

      act(() => {
        getEventInRow(resourceA.id, 'Solo A').focus();
      });
      expect(document.activeElement).to.equal(getEventInRow(resourceA.id, 'Solo A'));

      await user.keyboard('{Tab}');

      expect(document.activeElement).to.equal(getEventInRow(resourceA.id, 'Shared'));
    });
  });
});
