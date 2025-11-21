import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { getDayList } from './getDayList';
import { isWeekend } from '../use-adapter';

describe('getDayList', () => {
  it('should throw an error when amount is a non positive number', () => {
    expect(() =>
      getDayList({
        adapter,
        start: DEFAULT_TESTING_VISIBLE_DATE,
        end: DEFAULT_TESTING_VISIBLE_DATE,
      }),
    ).to.throw(/getDayList: The 'end' parameter must be after the 'start' parameter./);

    expect(() =>
      getDayList({
        adapter,
        start: DEFAULT_TESTING_VISIBLE_DATE,
        end: adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -5),
      }),
    ).to.throw(/getDayList: The 'end' parameter must be after the 'start' parameter./);
  });

  it('should return one day when the start and end dates are one day apart', () => {
    const days = getDayList({
      adapter,
      start: DEFAULT_TESTING_VISIBLE_DATE,
      end: adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 1),
    });

    expect(days).to.have.length(1);
    expect(days[0].value).to.toEqualDateTime(DEFAULT_TESTING_VISIBLE_DATE);
  });

  it('should return consecutive days', () => {
    const days = getDayList({
      adapter,
      start: DEFAULT_TESTING_VISIBLE_DATE,
      end: adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 4),
    });

    expect(days).to.have.length(4);

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    for (let i = 0; i < 4; i += 1) {
      const expectedDate = adapter.addDays(start, i);
      expect(days[i].value).to.toEqualDateTime(expectedDate);
    }
  });

  it('should exclude weekends when excludeWeekends=true', () => {
    const days = getDayList({
      adapter,
      start: adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE),
      end: adapter.endOfWeek(DEFAULT_TESTING_VISIBLE_DATE),
      excludeWeekends: true,
    });

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    const rawDays = [...Array(7)].map((_, i) => adapter.addDays(start, i));

    const filtered = rawDays.filter((day) => {
      // Same logic as hook: exclude if weekend
      return !isWeekend(adapter, day);
    });

    expect(days).to.have.length(filtered.length);

    filtered.forEach((day, idx) => {
      expect(days[idx].value).to.toEqualDateTime(day);
    });
  });
});
