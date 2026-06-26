import { adapter, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { getStartOfWeek } from '@mui/x-scheduler-internals/internals';
import type { EventCalendarPreferences } from '@mui/x-scheduler-internals/models';
import { createDayTimeGridViewConfig } from './day-time-grid-view-config';

describe('createDayTimeGridViewConfig', () => {
  // 2025-07-03 is a Thursday.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');

  function getState(defaultPreferences?: Partial<EventCalendarPreferences>) {
    return getEventCalendarStateFromParameters({ events: [], visibleDate, defaultPreferences });
  }

  describe('contiguous day counts', () => {
    it('renders a single day starting from the visible date for dayCount=1', () => {
      const days = createDayTimeGridViewConfig(1).visibleDaysSelector(getState());
      expect(days).to.have.length(1);
      expect(days[0].value).toEqualDateTime(visibleDate);
    });

    it('renders 3 consecutive days starting from the visible date for dayCount=3', () => {
      const days = createDayTimeGridViewConfig(3).visibleDaysSelector(getState());
      expect(days).to.have.length(3);
      days.forEach((day, index) => {
        expect(day.value).toEqualDateTime(adapter.addDays(visibleDate, index));
      });
    });
  });

  describe('week-aligned day count (dayCount=7)', () => {
    it('snaps to the start of the week and renders 7 days when weekends are shown', () => {
      const days = createDayTimeGridViewConfig(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 0 }),
      );
      expect(days).to.have.length(7);
      expect(days[0].value).toEqualDateTime(getStartOfWeek(adapter, visibleDate, 0));
    });

    it('excludes weekends (5 columns) when showWeekends is false', () => {
      const days = createDayTimeGridViewConfig(7).visibleDaysSelector(
        getState({ showWeekends: false, weekStartsOn: 0 }),
      );
      expect(days).to.have.length(5);
    });

    it('respects the weekStartsOn preference', () => {
      const sundayStart = createDayTimeGridViewConfig(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 0 }),
      );
      const mondayStart = createDayTimeGridViewConfig(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 1 }),
      );
      expect(sundayStart[0].value).toEqualDateTime(getStartOfWeek(adapter, visibleDate, 0));
      expect(mondayStart[0].value).toEqualDateTime(getStartOfWeek(adapter, visibleDate, 1));
    });
  });

  describe('navigation step (siblingVisibleDateGetter)', () => {
    it('steps by dayCount days for a contiguous (3-day) view', () => {
      const config = createDayTimeGridViewConfig(3);
      const state = getState();
      expect(config.siblingVisibleDateGetter({ state, delta: 1 })).toEqualDateTime(
        adapter.addDays(visibleDate, 3),
      );
      expect(config.siblingVisibleDateGetter({ state, delta: -1 })).toEqualDateTime(
        adapter.addDays(visibleDate, -3),
      );
    });

    it('steps week-aligned for the 7-day view', () => {
      const config = createDayTimeGridViewConfig(7);
      const state = getState({ weekStartsOn: 0 });
      const weekStart = getStartOfWeek(adapter, visibleDate, 0);
      expect(config.siblingVisibleDateGetter({ state, delta: 1 })).toEqualDateTime(
        adapter.addWeeks(weekStart, 1),
      );
      expect(config.siblingVisibleDateGetter({ state, delta: -1 })).toEqualDateTime(
        adapter.addWeeks(weekStart, -1),
      );
    });
  });
});
