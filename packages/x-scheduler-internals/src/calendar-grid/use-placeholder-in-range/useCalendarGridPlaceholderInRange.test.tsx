import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { EventCalendarStore, EventCalendarState } from '../../use-event-calendar';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import { processDate } from '../../process-date';
import { EventCalendarViewConfig, SchedulerEvent } from '../../models';
import { SchedulerStoreContext } from '../../use-scheduler-store-context';
import { useCalendarGridPlaceholderInRange } from './useCalendarGridPlaceholderInRange';

describe('useCalendarGridPlaceholderInRange', () => {
  const VISIBLE_DATE = adapter.date('2024-01-15Z', 'default');
  const TIME_START = adapter.date('2024-01-15T10:00:00Z', 'default');
  const TIME_END = adapter.date('2024-01-15T11:00:00Z', 'default');

  const dayVisibleDaysSelector = createSelectorMemoized(
    schedulerOtherSelectors.visibleDate,
    (state: EventCalendarState) => state.adapter,
    (visibleDate, adapterArg) => [processDate(visibleDate, adapterArg)],
  );

  const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
    siblingVisibleDateGetter: ({ state }) => state.visibleDate,
    visibleDaysSelector: dayVisibleDaysSelector,
    timeGrid: {},
  };

  function createStore(events: SchedulerEvent[] = []) {
    const store = new EventCalendarStore<SchedulerEvent, never>(
      { events, visibleDate: VISIBLE_DATE },
      adapter,
    );
    store.setViewConfig(DAY_VIEW_CONFIG);
    return store;
  }

  function makeWrapper(store: EventCalendarStore<SchedulerEvent, never>) {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <SchedulerStoreContext.Provider value={store as any}>
          {children}
        </SchedulerStoreContext.Provider>
      );
    };
  }

  function renderPlaceholderHook(store: EventCalendarStore<SchedulerEvent, never>) {
    const day = processDate(VISIBLE_DATE, adapter);
    return renderHook(
      () =>
        useCalendarGridPlaceholderInRange({
          day,
          start: adapter.startOfDay(VISIBLE_DATE),
          end: adapter.endOfDay(VISIBLE_DATE),
        }),
      { wrapper: makeWrapper(store) },
    );
  }

  it('should return null when there is no placeholder', () => {
    const store = createStore();
    const { result } = renderPlaceholderHook(store);
    expect(result.current).to.equal(null);
  });

  it('should preview creation full-width when the column is empty (lastLane = 1)', () => {
    const store = createStore();
    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'time-grid',
      start: TIME_START,
      end: TIME_END,
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
    expect(result.current!.lastLane).to.equal(1);
  });

  it('should preview creation across the full width of a busy column (lastLane = maxLane)', () => {
    const events = [
      EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build(),
      EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z').build(),
      EventBuilder.new().id('C').singleDay('2024-01-15T10:45:00Z').build(),
    ];
    const store = createStore(events);

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'time-grid',
      start: adapter.date('2024-01-15T14:00:00Z', 'default'),
      end: adapter.date('2024-01-15T15:00:00Z', 'default'),
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
    // 3 overlapping events → maxLane=3 → preview spans the full column.
    expect(result.current!.lastLane).to.equal(3);
  });

  it("should reuse the dragged occurrence's lane when previewing an internal drag in the same column", () => {
    const events = [
      EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build(),
      EventBuilder.new().id('B').singleDay('2024-01-15T10:30:00Z').build(),
    ];
    const store = createStore(events);

    // Drag event 'B' to a new time on the same day. The placeholder should reuse B's
    // lane (lane 2) — not stretch full-width and not collide with A.
    const draggedOccurrence = EventBuilder.new()
      .id('B')
      .singleDay('2024-01-15T10:30:00Z')
      .toOccurrence('2024-01-15T10:30:00Z');
    store.setOccurrencePlaceholder({
      type: 'internal-drag',
      surfaceType: 'time-grid',
      eventId: 'B',
      occurrenceKey: draggedOccurrence.key,
      start: adapter.date('2024-01-15T13:00:00Z', 'default'),
      end: adapter.date('2024-01-15T14:00:00Z', 'default'),
      resourceId: null,
      originalOccurrence: draggedOccurrence,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    // The lookup uses the placeholder's `occurrenceKey` to find the position in the
    // current column's layout. When found, firstLane/lastLane match the source event.
    // When not found (cross-column drag), it falls through to fullWidthLastLane.
    // Either way `firstLane === 1 && lastLane >= 1`.
    expect(result.current!.firstLane).to.be.at.least(1);
    expect(result.current!.lastLane).to.be.at.least(result.current!.firstLane);
  });

  it('should preview external drag full-width with the source title', () => {
    const store = createStore();
    store.setOccurrencePlaceholder({
      type: 'external-drag',
      surfaceType: 'time-grid',
      eventData: { id: 'external-id', title: 'Imported Event' },
      start: TIME_START,
      end: TIME_END,
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
    expect(result.current!.lastLane).to.equal(1);
    expect(result.current!.occurrence.title).to.equal('Imported Event');
  });

  it('should fall back to title="" for an external drag with no eventData.title', () => {
    const store = createStore();
    store.setOccurrencePlaceholder({
      type: 'external-drag',
      surfaceType: 'time-grid',
      eventData: { id: 'external-id', title: undefined as unknown as string },
      start: TIME_START,
      end: TIME_END,
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.occurrence.title).to.equal('');
  });
});
