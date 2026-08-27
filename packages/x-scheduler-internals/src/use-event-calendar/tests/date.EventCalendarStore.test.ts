import { adapter } from 'test/utils/scheduler';
import { describe, it, expect, vi } from 'vitest';
import { EventCalendarStore } from '../EventCalendarStore';
import type { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

describe('Date - EventCalendarStore', () => {
  describe('Method: switchToDay', () => {
    it('should update store and calls both callbacks when both change when is uncontrolled', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const initialDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          defaultVisibleDate: initialDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);

      expect(onVisibleDateChange.mock.calls.length).to.equal(1);
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(nextDate);
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should NOT mutate store but calls both callbacks when both change when is controlled', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const initialDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'week',
          visibleDate: initialDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('week');
      expect(store.state.visibleDate).toEqualDateTime(initialDate);

      expect(onVisibleDateChange.mock.calls.length).to.equal(1);
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(nextDate);
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should update date in store and calls onVisibleDateChange if only date changes when is uncontrolled', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'day',
          defaultVisibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should update date and calls only onVisibleDateChange when is partially controlled (view controlled, visibleDate uncontrolled)', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');
      const nextDate = adapter.date('2025-08-02T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          defaultVisibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should update view and calls only onViewChange when is partially controlled (view uncontrolled, visibleDate controlled)', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const currentDate = adapter.date('2025-08-01T00:00:00Z', 'default');

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          defaultView: 'week',
          visibleDate: currentDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(currentDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(currentDate);
      expect(onVisibleDateChange.mock.calls.length === 1).to.equal(false);
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should do nothing if nothing changes, does not update store or call callbacks', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const sameDate = adapter.date('2025-08-02T00:00:00Z', 'default');
      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: sameDate,
          onVisibleDateChange,
          onViewChange,
        },
        adapter,
      );

      store.switchToDay(sameDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(sameDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(0);
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should throw if the view is not an allowed view', () => {
      const store = new EventCalendarStore(
        { ...DEFAULT_PARAMS, views: ['week', 'month', 'agenda'] as CalendarView[] },
        adapter,
      );
      const newDate = adapter.date('2025-08-02T00:00:00Z', 'default');
      expect(() => store.switchToDay(newDate, {} as any)).to.throw(
        /is not part of the `views` prop/i,
      );
    });
  });

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = vi.fn();
      const targetDate = adapter.date('2025-07-03T00:00:00Z', 'default');
      const siblingVisibleDateGetter = vi.fn(() => targetDate);

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
          onVisibleDateChange,
        },
        adapter,
      );

      store.setViewDefinition({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });
      store.goToPreviousVisibleDate({} as any);
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.mock.lastCall?.[0].delta).toEqual(-1);
    });
  });

  describe('Method: goToNextVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = vi.fn();
      const targetDate = adapter.date('2025-07-03T00:00:00Z', 'default');
      const siblingVisibleDateGetter = vi.fn(() => targetDate);

      const store = new EventCalendarStore(
        {
          ...DEFAULT_PARAMS,
          view: 'day',
          visibleDate: adapter.date('2025-07-01T00:00:00Z', 'default'),
          onVisibleDateChange,
        },
        adapter,
      );

      store.setViewDefinition({
        siblingVisibleDateGetter,
        visibleDaysSelector: () => [],
      });
      store.goToNextVisibleDate({} as any);
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(targetDate);
      expect(siblingVisibleDateGetter.mock.lastCall?.[0].delta).toEqual(1);
    });
  });
});
