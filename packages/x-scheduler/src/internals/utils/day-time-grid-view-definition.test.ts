import {
  adapter,
  getEventCalendarStateFromParameters,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import type { EventCalendarPreferences } from '@mui/x-scheduler-internals/models';
import { describe, it, expect } from 'vitest';
import { createDayTimeGridViewDefinition } from './day-time-grid-view-definition';

describe('createDayTimeGridViewDefinition', () => {
  // 2025-07-03 is a Thursday.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');

  function getState(defaultPreferences?: Partial<EventCalendarPreferences>) {
    return getEventCalendarStateFromParameters({ events: [], visibleDate, defaultPreferences });
  }

  describe('contiguous day counts', () => {
    it('renders a single day starting from the visible date for dayCount=1', () => {
      const days = createDayTimeGridViewDefinition(1).visibleDaysSelector(getState());
      expect(days).to.have.length(1);
      expect(days[0].value).toEqualDateTime(visibleDate);
    });

    it('starts the days at midnight when the visible date has a time of day', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: adapter.date('2025-07-03T14:30:00Z', 'default'),
      });
      const days = createDayTimeGridViewDefinition(3).visibleDaysSelector(state);
      expect(days.map((day) => adapter.toJsDate(day.value).toISOString())).to.deep.equal([
        '2025-07-03T00:00:00.000Z',
        '2025-07-04T00:00:00.000Z',
        '2025-07-05T00:00:00.000Z',
      ]);
    });

    it('renders 3 consecutive days starting from the visible date for dayCount=3', () => {
      const days = createDayTimeGridViewDefinition(3).visibleDaysSelector(getState());
      expect(days).to.have.length(3);
      days.forEach((day, index) => {
        expect(day.value).toEqualDateTime(adapter.addDays(visibleDate, index));
      });
    });
  });

  describe('week-aligned day count (dayCount=7)', () => {
    it('snaps to the start of the week and renders 7 days when weekends are shown', () => {
      const days = createDayTimeGridViewDefinition(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 0 }),
      );
      expect(days).to.have.length(7);
      // Thursday, July 3rd, 2025 is in the week that starts on Sunday, June 29th.
      expect(days[0].plainDate).toEqualPlainDate('2025-06-29');
    });

    it('excludes weekends (5 columns) when showWeekends is false', () => {
      const days = createDayTimeGridViewDefinition(7).visibleDaysSelector(
        getState({ showWeekends: false, weekStartsOn: 0 }),
      );
      expect(days).to.have.length(5);
    });

    it('respects the weekStartsOn preference', () => {
      const sundayStart = createDayTimeGridViewDefinition(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 0 }),
      );
      const mondayStart = createDayTimeGridViewDefinition(7).visibleDaysSelector(
        getState({ showWeekends: true, weekStartsOn: 1 }),
      );
      expect(sundayStart[0].plainDate).toEqualPlainDate('2025-06-29');
      expect(mondayStart[0].plainDate).toEqualPlainDate('2025-06-30');
    });
  });

  describe('navigation step (siblingVisibleDateGetter)', () => {
    it('steps by dayCount days for a contiguous (3-day) view', () => {
      const definition = createDayTimeGridViewDefinition(3);
      const state = getState();
      expect(definition.siblingVisibleDateGetter({ state, delta: 1 })).toEqualDateTime(
        adapter.addDays(visibleDate, 3),
      );
      expect(definition.siblingVisibleDateGetter({ state, delta: -1 })).toEqualDateTime(
        adapter.addDays(visibleDate, -3),
      );
    });

    it.skipIf(!isJSDOM)(
      'keeps the time of day of the visible date, whatever the timezone of the system',
      () => {
        setSystemTimezone('Europe/Paris');
        // London leaves summer time on October 25th, 2026, when 02:00 becomes 01:00 again.
        const state = getEventCalendarStateFromParameters({
          events: [],
          visibleDate: adapter.date('2026-10-24T02:00:00', 'Europe/London'),
          displayTimezone: 'Europe/London',
        });
        const nextVisibleDate = createDayTimeGridViewDefinition(1).siblingVisibleDateGetter({
          state,
          delta: 1,
        });
        expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal(
          '2026-10-25T02:00:00.000Z',
        );
      },
    );

    it('steps week-aligned for the 7-day view', () => {
      const definition = createDayTimeGridViewDefinition(7);
      const state = getState({ weekStartsOn: 0 });
      // The week of Thursday, July 3rd, 2025 starts on Sunday, June 29th.
      expect(definition.siblingVisibleDateGetter({ state, delta: 1 })).toEqualDateTime(
        '2025-07-06T00:00:00Z',
      );
      expect(definition.siblingVisibleDateGetter({ state, delta: -1 })).toEqualDateTime(
        '2025-06-22T00:00:00Z',
      );
    });

    it('goes to the midnight of the next week when the week starts later than midnight', () => {
      // America/Santiago enters summer time at the start of Sunday, September 8th, 2024: that week
      // starts at 01:00, and the next one at midnight.
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: adapter.date('2024-09-10T12:00:00', 'America/Santiago'),
        displayTimezone: 'America/Santiago',
        defaultPreferences: { weekStartsOn: 0 },
      });
      const nextVisibleDate = createDayTimeGridViewDefinition(7).siblingVisibleDateGetter({
        state,
        delta: 1,
      });
      expect(adapter.toJsDate(nextVisibleDate).toISOString()).to.equal('2024-09-15T03:00:00.000Z');
    });
  });
});
