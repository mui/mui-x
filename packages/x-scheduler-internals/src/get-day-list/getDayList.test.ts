import { adapter, DEFAULT_TESTING_VISIBLE_DATE, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { getDayList } from './getDayList';
import { isWeekend } from '../use-adapter';
import { processDate } from '../process-date';

describe('getDayList', () => {
  it('should throw an error when amount is a non positive number', () => {
    expect(() =>
      getDayList({
        adapter,
        start: DEFAULT_TESTING_VISIBLE_DATE,
        end: adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -5),
      }),
    ).to.throw(/must be a day after/);
  });

  it('should return one day when the start and end dates are equal', () => {
    const days = getDayList({
      adapter,
      start: DEFAULT_TESTING_VISIBLE_DATE,
      end: DEFAULT_TESTING_VISIBLE_DATE,
    });

    const expectedDays = [processDate(adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE), adapter)];

    expect(days).to.deep.equal(expectedDays);
  });

  it('should return consecutive days', () => {
    const days = getDayList({
      adapter,
      start: DEFAULT_TESTING_VISIBLE_DATE,
      end: adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 3),
    });

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    const expectedDays = Array.from({ length: 4 }, (_, i) =>
      processDate(adapter.addDays(start, i), adapter),
    );

    expect(days).to.deep.equal(expectedDays);
  });

  it('should exclude weekends when excludeWeekends=true', () => {
    const days = getDayList({
      adapter,
      start: adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE),
      end: adapter.endOfWeek(DEFAULT_TESTING_VISIBLE_DATE),
      excludeWeekends: true,
    });

    const start = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    const expectedDays = Array.from({ length: 7 }, (_, i) =>
      processDate(adapter.addDays(start, i), adapter),
    ).filter((day) => !isWeekend(adapter, day.value));

    expect(days).to.deep.equal(expectedDays);
  });

  it('should skip the days the timezone skips', () => {
    // Pacific/Apia skipped December 30th, 2011.
    const days = getDayList({
      adapter,
      start: adapter.date('2011-12-29T12:00:00', 'Pacific/Apia'),
      end: adapter.date('2011-12-31T12:00:00', 'Pacific/Apia'),
    });
    expect(days.map((day) => day.key)).to.deep.equal(['12/29/2011', '12/31/2011']);
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)('should return the same days whatever the timezone of the system', () => {
    // America/Santiago falls back from 00:00 to 23:00 on April 5th, 2026, the day
    // Australia/Lord_Howe falls back from 02:00 to 01:30.
    setSystemTimezone('Australia/Lord_Howe');
    const start = adapter.date('2026-03-30T00:00:00', 'America/Santiago');
    const days = getDayList({ adapter, start, end: adapter.addDays(start, 34) });
    expect(days).to.have.length(35);
    expect(new Set(days.map((day) => day.key)).size).to.equal(35);
    expect(days.every((day) => day.minutesInDay === 0)).to.equal(true);
  });
});
