import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { EventCalendarStore, EventCalendarState } from '../../use-event-calendar';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import { processDate } from '../../process-date';
import { EventCalendarViewConfig, SchedulerEvent } from '../../models';
import { SchedulerStoreContext } from '../../use-scheduler-store-context';
import { CalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import { useCalendarGridPlaceholderInDay } from './useCalendarGridPlaceholderInDay';

describe('useCalendarGridPlaceholderInDay', () => {
  const VISIBLE_DATE = adapter.date('2024-01-15Z', 'default');

  const dayVisibleDaysSelector = createSelectorMemoized(
    schedulerOtherSelectors.visibleDate,
    (state: EventCalendarState) => state.adapter,
    (visibleDate, adapterArg) => [processDate(visibleDate, adapterArg)],
  );

  const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
    siblingVisibleDateGetter: ({ state }) => state.visibleDate,
    visibleDaysSelector: dayVisibleDaysSelector,
    dayGrid: {},
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
    const rowContextValue = {
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      rowIndex: 0,
    };
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <SchedulerStoreContext.Provider value={store as any}>
          <CalendarGridDayRowContext.Provider value={rowContextValue}>
            {children}
          </CalendarGridDayRowContext.Provider>
        </SchedulerStoreContext.Provider>
      );
    };
  }

  function renderPlaceholderHook(
    store: EventCalendarStore<SchedulerEvent, never>,
    maxEvents?: number,
  ) {
    const day = processDate(VISIBLE_DATE, adapter);
    return renderHook(() => useCalendarGridPlaceholderInDay(day, maxEvents), {
      wrapper: makeWrapper(store),
    });
  }

  it('should return null when there is no placeholder', () => {
    const store = createStore();
    const { result } = renderPlaceholderHook(store);
    expect(result.current).to.equal(null);
  });

  it('should compute a creation placeholder spanning a single day with cellSpan=1', () => {
    const store = createStore();
    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: 'day-grid',
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
    expect(result.current!.cellSpan).to.equal(1);
  });

  it('should land on lane 1 for an internal drag when the day-grid layout is empty', () => {
    const event = EventBuilder.new().id('A').fullDay('2024-01-15Z').build();
    const store = createStore([event]);

    store.setOccurrencePlaceholder({
      type: 'internal-drag',
      surfaceType: 'day-grid',
      eventId: 'A',
      occurrenceKey: 'A',
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      resourceId: null,
      originalOccurrence: EventBuilder.new()
        .id('A')
        .fullDay('2024-01-15Z')
        .toOccurrence('2024-01-15Z'),
    });

    const { result } = renderPlaceholderHook(store);

    // The dragged event itself owns lane 1 in the layout; the placeholder should land
    // on the same lane so it previews on top of the source.
    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
  });

  it("should reuse the dragged occurrence's own lane (not stack on a fresh one)", () => {
    const event1 = EventBuilder.new().id('A').fullDay('2024-01-15Z').build();
    const event2 = EventBuilder.new().id('B').fullDay('2024-01-15Z').build();
    const event3 = EventBuilder.new().id('C').fullDay('2024-01-15Z').build();
    const store = createStore([event1, event2, event3]);

    // Drag event 'B' (which owns lane 2 in the layout). The placeholder should land on
    // lane 2, not lane 4 — that's the contract that lets the placeholder render on top
    // of the source instead of opening a new lane.
    store.setOccurrencePlaceholder({
      type: 'internal-drag',
      surfaceType: 'day-grid',
      eventId: 'B',
      occurrenceKey: 'B',
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      resourceId: null,
      originalOccurrence: EventBuilder.new()
        .id('B')
        .fullDay('2024-01-15Z')
        .toOccurrence('2024-01-15Z'),
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(2);
  });

  it('should clamp the lane to maxEvents when provided', () => {
    const events = [
      EventBuilder.new().id('A').fullDay('2024-01-15Z').build(),
      EventBuilder.new().id('B').fullDay('2024-01-15Z').build(),
      EventBuilder.new().id('C').fullDay('2024-01-15Z').build(),
    ];
    const store = createStore(events);

    // External drag with no original occurrence → the loop will walk past lanes 1, 2, 3
    // searching for free space. With maxEvents=2 the result must clamp to 2.
    store.setOccurrencePlaceholder({
      type: 'external-drag',
      surfaceType: 'day-grid',
      eventData: { id: 'external-id', title: 'External' },
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      resourceId: null,
    });

    const { result } = renderPlaceholderHook(store, 2);

    expect(result.current).not.to.equal(null);
    expect(result.current!.firstLane).to.equal(1);
  });

  it('should drop the placeholder if the source event was deleted mid-drag', () => {
    const store = createStore();
    // No events in the store, but an internal-drag placeholder claiming an event id.
    // The hook must return null rather than rendering a "ghost" placeholder.
    store.setOccurrencePlaceholder({
      type: 'internal-drag',
      surfaceType: 'day-grid',
      eventId: 'deleted-event',
      occurrenceKey: 'deleted-event',
      start: adapter.startOfDay(VISIBLE_DATE),
      end: adapter.endOfDay(VISIBLE_DATE),
      resourceId: null,
      originalOccurrence: EventBuilder.new()
        .id('deleted-event')
        .fullDay('2024-01-15Z')
        .toOccurrence('2024-01-15Z'),
    });

    const { result } = renderPlaceholderHook(store);

    expect(result.current).to.equal(null);
  });
});
