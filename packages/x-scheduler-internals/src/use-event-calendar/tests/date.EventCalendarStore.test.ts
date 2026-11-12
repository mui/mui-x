import { createDate } from 'test/utils/scheduler';
import { vi, describe, it, expect } from 'vitest';
import { EventCalendarStore } from '../EventCalendarStore';
import type { CalendarView } from '../../models';

const DEFAULT_PARAMS = { events: [] };

describe('Date - EventCalendarStore', () => {
  describe('Method: switchToDay', () => {
    it('should update store and calls both callbacks when both change when is uncontrolled', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const initialDate = createDate('2025-08-01T00:00:00Z');
      const nextDate = createDate('2025-08-02T00:00:00Z');

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'week',
        defaultVisibleDate: initialDate,
        onVisibleDateChange,
        onViewChange,
      });

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

      const initialDate = createDate('2025-08-01T00:00:00Z');
      const nextDate = createDate('2025-08-02T00:00:00Z');

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        view: 'week',
        visibleDate: initialDate,
        onVisibleDateChange,
        onViewChange,
      });

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

      const currentDate = createDate('2025-08-01T00:00:00Z');
      const nextDate = createDate('2025-08-02T00:00:00Z');

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'day',
        defaultVisibleDate: currentDate,
        onVisibleDateChange,
        onViewChange,
      });

      store.switchToDay(nextDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(nextDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should update view and calls only onViewChange when is partially controlled (view uncontrolled, visibleDate controlled)', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const currentDate = createDate('2025-08-01T00:00:00Z');

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        defaultView: 'week',
        visibleDate: currentDate,
        onVisibleDateChange,
        onViewChange,
      });

      store.switchToDay(currentDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(currentDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(0);
      expect(onViewChange.mock.calls.length).to.equal(1);
      expect(onViewChange.mock.lastCall?.[0]).to.equal('day');
    });

    it('should do nothing if nothing changes, does not update store or call callbacks', () => {
      const onVisibleDateChange = vi.fn();
      const onViewChange = vi.fn();

      const sameDate = createDate('2025-08-02T00:00:00Z');
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        view: 'day',
        visibleDate: sameDate,
        onVisibleDateChange,
        onViewChange,
      });

      store.switchToDay(sameDate, {} as any);

      expect(store.state.view).to.equal('day');
      expect(store.state.visibleDate).toEqualDateTime(sameDate);
      expect(onVisibleDateChange.mock.calls.length).to.equal(0);
      expect(onViewChange.mock.calls.length).to.equal(0);
    });

    it('should throw if the view is not an allowed view', () => {
      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        views: ['week', 'month', 'agenda'] as CalendarView[],
      });
      const newDate = createDate('2025-08-02T00:00:00Z');
      expect(() => store.switchToDay(newDate, {} as any)).to.throw(
        /is not part of the `views` prop/i,
      );
    });
  });

  describe('Method: goToPreviousVisibleDate', () => {
    it('should respect the date returned by setSiblingVisibleDateGetter', () => {
      const onVisibleDateChange = vi.fn();
      const targetDate = createDate('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = vi.fn((_parameters: { delta: 1 | -1 }) => targetDate);

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        view: 'day',
        visibleDate: createDate('2025-07-01T00:00:00Z'),
        onVisibleDateChange,
      });

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
      const targetDate = createDate('2025-07-03T00:00:00Z');
      const siblingVisibleDateGetter = vi.fn((_parameters: { delta: 1 | -1 }) => targetDate);

      const store = new EventCalendarStore({
        ...DEFAULT_PARAMS,
        view: 'day',
        visibleDate: createDate('2025-07-01T00:00:00Z'),
        onVisibleDateChange,
      });

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
