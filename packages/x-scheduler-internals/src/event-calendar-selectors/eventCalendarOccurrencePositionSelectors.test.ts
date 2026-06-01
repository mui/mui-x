import { createSelectorMemoized } from '@base-ui/utils/store';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { EventCalendarStore, EventCalendarState } from '../use-event-calendar';
import { processDate } from '../process-date';
import { schedulerOtherSelectors } from '../scheduler-selectors';
import { EventCalendarViewConfig, SchedulerEvent } from '../models';
import { eventCalendarOccurrencePositionSelectors } from './eventCalendarOccurrencePositionSelectors';

describe('eventCalendarOccurrencePositionSelectors', () => {
  const VISIBLE_DATE = adapter.date('2024-01-15Z', 'default');

  // Memoized — matches what production views (DayView, WeekView, MonthView) build.
  // A non-memoized selector here would trip reselect's input-stability check.
  const dayVisibleDaysSelector = createSelectorMemoized(
    schedulerOtherSelectors.visibleDate,
    (state: EventCalendarState) => state.adapter,
    (visibleDate, adapterArg) => [processDate(visibleDate, adapterArg)],
  );

  const DAY_VIEW_CONFIG: EventCalendarViewConfig = {
    siblingVisibleDateGetter: ({ state }) => state.visibleDate,
    visibleDaysSelector: dayVisibleDaysSelector,
    dayGrid: {},
    timeGrid: {},
  };

  function createStore(events: SchedulerEvent[] = []) {
    const store = new EventCalendarStore({ events, visibleDate: VISIBLE_DATE }, adapter);
    store.setViewConfig(DAY_VIEW_CONFIG);
    return store;
  }

  describe('memoization', () => {
    it('should return referentially-equal `dayGridPositions` for two reads of the same state', () => {
      const store = createStore([EventBuilder.new().id('A').singleDay('2024-01-15Z').build()]);
      const first = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      const second = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      expect(first).to.equal(second);
    });

    it('should return referentially-equal `timeGridPositions` for two reads of the same state', () => {
      const store = createStore([
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build(),
      ]);
      const first = eventCalendarOccurrencePositionSelectors.timeGridPositions(store.state);
      const second = eventCalendarOccurrencePositionSelectors.timeGridPositions(store.state);
      expect(first).to.equal(second);
    });

    it('should return referentially-equal `visibleOccurrences` for two reads of the same state', () => {
      const store = createStore([EventBuilder.new().id('A').singleDay('2024-01-15Z').build()]);
      const first = eventCalendarOccurrencePositionSelectors.visibleOccurrences(store.state);
      const second = eventCalendarOccurrencePositionSelectors.visibleOccurrences(store.state);
      expect(first).to.equal(second);
    });

    it('should reuse positions when a content-equal view config is re-installed', () => {
      // Memoization tracks the config's *content* (visibleDaysSelector reference,
      // dayGrid/timeGrid presence, predicate references), not the wrapping object's
      // identity. Spreading into a fresh config object should not invalidate the cache.
      const store = new EventCalendarStore(
        {
          events: [EventBuilder.new().id('A').singleDay('2024-01-15Z').build()],
          visibleDate: VISIBLE_DATE,
        },
        adapter,
      );

      store.setViewConfig({ ...DAY_VIEW_CONFIG });
      const firstPositions = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);

      store.setViewConfig({ ...DAY_VIEW_CONFIG });
      const secondPositions = eventCalendarOccurrencePositionSelectors.dayGridPositions(
        store.state,
      );

      expect(firstPositions).to.equal(secondPositions);
    });
  });

  describe('empty fallbacks', () => {
    it('should return frozen empty values when `viewConfig` is null', () => {
      // Pre-mount window: a view component renders before its `useOnMount` effect installs
      // the config. Selectors must not throw and must return stable empty values.
      const store = new EventCalendarStore({ events: [] }, adapter);
      expect(store.state.viewConfig).to.equal(null);

      const occurrences = eventCalendarOccurrencePositionSelectors.visibleOccurrences(store.state);
      expect(occurrences.byKey.size).to.equal(0);
      expect(occurrences.dayKeys).to.have.length(0);

      const dayGrid = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      expect(dayGrid.maxLane).to.equal(1);
      expect(dayGrid.byContainer.size).to.equal(0);

      const timeGrid = eventCalendarOccurrencePositionSelectors.timeGridPositions(store.state);
      expect(timeGrid.maxLane).to.equal(1);
      expect(timeGrid.byContainer.size).to.equal(0);
    });
  });

  describe('content', () => {
    it('should index occurrences by key for a configured view', () => {
      const store = createStore([
        EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build(),
        EventBuilder.new().id('B').singleDay('2024-01-15T12:00:00Z').build(),
      ]);
      const occurrences = eventCalendarOccurrencePositionSelectors.visibleOccurrences(store.state);
      expect(occurrences.byKey.has('A')).to.equal(true);
      expect(occurrences.byKey.has('B')).to.equal(true);
    });

    it('should produce day-grid positions only for occurrences passing `shouldAddPosition`', () => {
      const store = new EventCalendarStore(
        {
          events: [
            EventBuilder.new().id('all-day').fullDay('2024-01-15Z').build(),
            EventBuilder.new().id('timed').singleDay('2024-01-15T10:00:00Z').build(),
          ],
          visibleDate: VISIBLE_DATE,
        },
        adapter,
      );
      store.setViewConfig({
        siblingVisibleDateGetter: ({ state }) => state.visibleDate,
        visibleDaysSelector: dayVisibleDaysSelector,
        dayGrid: { shouldAddPosition: (occurrence) => occurrence.allDay === true },
        timeGrid: { shouldAddPosition: (occurrence) => occurrence.allDay !== true },
      });

      const dayGrid = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      expect(dayGrid.positionByKey.has('all-day')).to.equal(true);
      expect(dayGrid.positionByKey.has('timed')).to.equal(false);

      const timeGrid = eventCalendarOccurrencePositionSelectors.timeGridPositions(store.state);
      expect(timeGrid.positionByKey.has('timed')).to.equal(true);
      expect(timeGrid.positionByKey.has('all-day')).to.equal(false);
    });
  });
});
