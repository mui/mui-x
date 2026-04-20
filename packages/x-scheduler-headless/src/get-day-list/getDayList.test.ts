import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
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
});
