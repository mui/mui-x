import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  processDay,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { getDayListFromPlainDates } from './getDayList';
import { isWeekendPlainDate } from '../internals/utils/plain-date-utils/plainDate';
import { PlainDate } from '../internals/utils/base-temporal/PlainDate';

describe('getDayListFromPlainDates', () => {
  // July 3rd, 2025, a Thursday.
  const plainDate = PlainDate.from('2025-07-03');

  it('should return no day when the last date is before the first one', () => {
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate: plainDate,
      lastPlainDate: plainDate.add({ days: -5 }),
      timezone: 'default',
    });

    expect(days).to.deep.equal([]);
  });

  it('should return one day when the first and last dates are equal', () => {
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate: plainDate,
      lastPlainDate: plainDate,
      timezone: 'default',
    });

    const expectedDays = [processDay(adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE), adapter)];

    expect(days).to.deep.equal(expectedDays);
  });

  it('should return consecutive days', () => {
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate: plainDate,
      lastPlainDate: plainDate.add({ days: 3 }),
      timezone: 'default',
    });

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    const expectedDays = Array.from({ length: 4 }, (_, i) =>
      processDay(adapter.addDays(start, i), adapter),
    );

    expect(days).to.deep.equal(expectedDays);
  });

  it('should exclude weekends when excludeWeekends=true', () => {
    // From Sunday, June 29th to Saturday, July 5th, 2025.
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate: plainDate.add({ days: -4 }),
      lastPlainDate: plainDate.add({ days: 2 }),
      timezone: 'default',
      excludeWeekends: true,
    });

    const start = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    const expectedDays = Array.from({ length: 7 }, (_, i) =>
      processDay(adapter.addDays(start, i), adapter),
    ).filter((day) => !isWeekendPlainDate(day.plainDate));

    expect(days).to.deep.equal(expectedDays);
  });

  it('should skip the days the timezone skips', () => {
    // Pacific/Apia skipped December 30th, 2011.
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate: PlainDate.from('2011-12-29'),
      lastPlainDate: PlainDate.from('2011-12-31'),
      timezone: 'Pacific/Apia',
    });
    expect(days.map((day) => day.key)).to.deep.equal(['2011-12-29', '2011-12-31']);
  });

  it('should start the days after a DST transition at midnight at midnight', () => {
    // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
    const firstPlainDate = PlainDate.from('2026-03-07');
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate,
      lastPlainDate: firstPlainDate.add({ days: 3 }),
      timezone: 'America/Havana',
    });
    expect(days.map((day) => day.key)).to.deep.equal([
      '2026-03-07',
      '2026-03-08',
      '2026-03-09',
      '2026-03-10',
    ]);
    // March 8th has no midnight, so it starts at 01:00.
    expect(days.map((day) => day.minutesInDay)).to.deep.equal([0, 60, 0, 0]);
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)('should return the same days whatever the timezone of the system', () => {
    // America/Santiago falls back from 00:00 to 23:00 on April 5th, 2026, the day
    // Australia/Lord_Howe falls back from 02:00 to 01:30.
    setSystemTimezone('Australia/Lord_Howe');
    const firstPlainDate = PlainDate.from('2026-03-30');
    const days = getDayListFromPlainDates({
      adapter,
      firstPlainDate,
      lastPlainDate: firstPlainDate.add({ days: 34 }),
      timezone: 'America/Santiago',
    });
    expect(days).to.have.length(35);
    expect(new Set(days.map((day) => day.key)).size).to.equal(35);
    expect(days.every((day) => day.minutesInDay === 0)).to.equal(true);
  });
});
