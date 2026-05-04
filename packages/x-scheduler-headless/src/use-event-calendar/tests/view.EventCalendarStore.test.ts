import { spy } from 'sinon';
import { createSelectorMemoized } from '@base-ui/utils/store';
import { adapter, EventBuilder } from 'test/utils/scheduler';
import { EventCalendarStore } from '../EventCalendarStore';
import { EventCalendarState } from '../EventCalendarStore.types';
import { EventCalendarViewConfig, SchedulerOccurrencesByDay } from '../../models';
import { eventCalendarOccurrencePositionSelectors } from '../../event-calendar-selectors';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import { processDate } from '../../process-date';

const DEFAULT_PARAMS = { events: [] };

const EMPTY_VISIBLE_OCCURRENCES: SchedulerOccurrencesByDay = {
  byKey: new Map(),
  keysByDay: new Map(),
  dayKeys: [],
};

describe('View - EventCalendarStore', () => {
  describe('Method: setView', () => {
    it('should update view and call onViewChange when value changes and is uncontrolled', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, onViewChange }, adapter);

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('day');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should NOT mutate store but calls onViewChange when is controlled', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, view: 'week', onViewChange },
        adapter,
      );

      store.setView('day', {} as any);

      expect(store.state.view).to.equal('week');
      expect(onViewChange.calledOnce).to.equal(true);
      expect(onViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should do nothing if setting the same view: no state change, no callback', () => {
      const onViewChange = spy();
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, defaultView: 'month', onViewChange },
        adapter,
      );

      store.setView('month', {} as any);

      expect(store.state.view).to.equal('month');
      expect(onViewChange.called).to.equal(false);
    });

    it('should throw when switching to a view not included in the allowed views', () => {
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, views: ['day', 'agenda'], defaultView: 'day' },
        adapter,
      );

      expect(() => store.setView('week', {} as any)).to.throw(/is not part of the `views` prop/i);
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          onViewChange: (_, eventDetails) => eventDetails.cancel(),
        },
        adapter,
      );

      store.setView('day', {} as any);
      expect(store.state.view).to.equal('week');
    });

    it('should warn in dev when controlled without an onViewChange handler', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, view: 'week' }, adapter);

      expect(() => store.setView('day', {} as any)).toWarnDev(
        'MUI X Scheduler: EventCalendar is controlled (received a `view` prop) but `onViewChange` is not provided',
      );
    });
  });

  describe('Method: switchToDay', () => {
    it('should update view and visibleDate when value changes and is uncontrolled', () => {
      const store = new EventCalendarStore({ ...DEFAULT_PARAMS, defaultView: 'week' }, adapter);

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime('2025-07-01');
    });

    it('should update view but not visibleDate when value changes and visibleDate is controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          visibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });

    it('should update visibleDate but not view when view is controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          defaultVisibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-07-01');
    });

    it('should NOT mutate store when both view and visibleDate are controlled', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          visibleDate: adapter.date('2025-06-15', 'default'),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });

    it('should NOT mutate store when onViewChange cancels the change', () => {
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          defaultVisibleDate: adapter.date('2025-06-15', 'default'),
          onViewChange: (_, eventDetails) => eventDetails.cancel(),
        },
        adapter,
      );

      store.switchToDay(adapter.date('2025-07-01', 'default'), {} as any);
      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime('2025-06-15');
    });
  });

  describe('Init validation', () => {
    it('should throw at init when the initial view is not included in the views array', () => {
      expect(
        () =>
          new EventCalendarStore(
            { ...DEFAULT_PARAMS, defaultView: 'week', views: ['day', 'agenda'] },
            adapter,
          ),
      ).to.throw(/is not part of the `views` prop/i);
    });
  });

  describe('Method: setViewConfig', () => {
    it('should set config and cleanup to null', () => {
      const store = new EventCalendarStore(DEFAULT_PARAMS, adapter);

      const siblingVisibleDateGetter = spy(
        ({ state }: { state: EventCalendarState }) => state.visibleDate,
      );
      const cleanup = store.setViewConfig({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
        visibleOccurrencesSelector: () => EMPTY_VISIBLE_OCCURRENCES,
      });

      expect(store.state.viewConfig?.siblingVisibleDateGetter).to.equal(siblingVisibleDateGetter);

      cleanup();

      expect(store.state.viewConfig).to.equal(null);
    });
  });

  describe('Occurrence storage across view transitions', () => {
    const VISIBLE_DATE = adapter.date('2024-01-15Z', 'default');

    const dayVisibleDaysSelector = createSelectorMemoized(
      schedulerOtherSelectors.visibleDate,
      (state: EventCalendarState) => state.adapter,
      (visibleDate, adapterArg) => [processDate(visibleDate, adapterArg)],
    );

    const weekVisibleDaysSelector = createSelectorMemoized(
      schedulerOtherSelectors.visibleDate,
      (state: EventCalendarState) => state.adapter,
      (visibleDate, adapterArg) => {
        const start = adapterArg.startOfWeek(visibleDate);
        return Array.from({ length: 7 }, (_, i) =>
          processDate(adapterArg.addDays(start, i), adapterArg),
        );
      },
    );

    const DAY_VIEW: EventCalendarViewConfig = {
      siblingVisibleDateGetter: ({ state }) => state.visibleDate,
      visibleDaysSelector: dayVisibleDaysSelector,
      dayGrid: {},
      timeGrid: {},
    };

    const WEEK_VIEW: EventCalendarViewConfig = {
      siblingVisibleDateGetter: ({ state }) => state.visibleDate,
      visibleDaysSelector: weekVisibleDaysSelector,
      dayGrid: {},
      timeGrid: {},
    };

    it('should populate occurrence-storage selectors immediately after setViewConfig', () => {
      // Pre-mount window: viewConfig=null → empty fallbacks. After registration the same
      // selector returns non-empty data without further state changes.
      const event = EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build();
      const store = new EventCalendarStore({ events: [event], visibleDate: VISIBLE_DATE }, adapter);

      const beforeConfig = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      expect(beforeConfig.byContainer.size).to.equal(0);

      store.setViewConfig(DAY_VIEW);

      const afterConfig = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      expect(afterConfig.byContainer.size).to.equal(1);
    });

    it('should produce a fresh layout shape after switching from day-view to week-view config', () => {
      // Switching views replaces visibleDaysSelector. The cached `previousDayGrid` is
      // stale from the previous view — `canReuseDayGridRow` must reject those entries
      // and the new view's selector must return its own correct shape.
      const event = EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build();
      const store = new EventCalendarStore({ events: [event], visibleDate: VISIBLE_DATE }, adapter);

      store.setViewConfig(DAY_VIEW);
      const dayGridForDayView = eventCalendarOccurrencePositionSelectors.dayGridPositions(
        store.state,
      );
      expect(dayGridForDayView.byContainer.size).to.equal(1);

      store.setViewConfig(WEEK_VIEW);
      const dayGridForWeekView = eventCalendarOccurrencePositionSelectors.dayGridPositions(
        store.state,
      );
      expect(dayGridForWeekView.byContainer.size).to.equal(7);
      expect(dayGridForWeekView).not.to.equal(dayGridForDayView);
    });

    it('should refresh occurrence-storage selectors when visibleDate changes', () => {
      const event1 = EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build();
      const event2 = EventBuilder.new().id('B').singleDay('2024-01-22T10:00:00Z').build();
      const store = new EventCalendarStore(
        // `defaultVisibleDate` keeps the field uncontrolled so `switchToDay` can update it.
        { events: [event1, event2], defaultVisibleDate: VISIBLE_DATE },
        adapter,
      );
      store.setViewConfig(DAY_VIEW);

      const occurrencesAtJan15 = eventCalendarOccurrencePositionSelectors.visibleOccurrences(
        store.state,
      );
      expect(occurrencesAtJan15.byKey.has('A')).to.equal(true);
      expect(occurrencesAtJan15.byKey.has('B')).to.equal(false);

      store.switchToDay(adapter.date('2024-01-22Z', 'default'), {} as any);
      const occurrencesAtJan22 = eventCalendarOccurrencePositionSelectors.visibleOccurrences(
        store.state,
      );
      expect(occurrencesAtJan22.byKey.has('A')).to.equal(false);
      expect(occurrencesAtJan22.byKey.has('B')).to.equal(true);
    });

    it('should keep day-grid positions stable when adding an event on a different day', () => {
      // The `previous` cache + `canReuseDayGridRow` are supposed to keep unchanged days
      // referentially stable across event additions. This test pins the contract for a
      // multi-day view (week), where adding an event on day 6 should not invalidate
      // day 0's layout.
      const event1 = EventBuilder.new().id('A').singleDay('2024-01-15T10:00:00Z').build();
      const store = new EventCalendarStore(
        { events: [event1], visibleDate: VISIBLE_DATE },
        adapter,
      );
      store.setViewConfig(WEEK_VIEW);

      const before = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      const day0Layout = before.byContainer.get(before.byContainer.keys().next().value!);

      // Add an event on a different day via the public createEvent API.
      store.createEvent({
        title: 'B',
        start: '2024-01-19T10:00:00Z',
        end: '2024-01-19T11:00:00Z',
      });

      const after = eventCalendarOccurrencePositionSelectors.dayGridPositions(store.state);
      const day0LayoutAfter = after.byContainer.get(after.byContainer.keys().next().value!);

      // Day 0 (Jan 14, Sunday) is unaffected by adding an event on Jan 19.
      expect(day0LayoutAfter).to.equal(day0Layout);
    });
  });
});
