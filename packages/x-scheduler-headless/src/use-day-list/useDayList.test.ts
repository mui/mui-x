import { renderHook } from '@mui/internal-test-utils';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { useDayList } from './useDayList';
import { isWeekend } from '../use-adapter';
import { SchedulerValidDate } from '../models';

describe('useDayList', () => {
  function testHook(date: SchedulerValidDate, amount: number | 'week', excludeWeekends?: boolean) {
    const { result } = renderHook(() => useDayList());
    return result.current({
      date,
      amount,
      excludeWeekends,
    });
  }

  it('should throw an error when amount is a non positive number', () => {
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, 0)).to.throw(/amount.*positive number/);
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, -5)).to.throw(/amount.*positive number/);
  });

  it('should return one day when amount=1', () => {
    const days = testHook(DEFAULT_TESTING_VISIBLE_DATE, 1);

    expect(days).to.have.length(1);
    expect(days[0].value).to.toEqualDateTime(DEFAULT_TESTING_VISIBLE_DATE);
  });

  it('should return consecutive days', () => {
    const days = testHook(DEFAULT_TESTING_VISIBLE_DATE, 4);

    expect(days).to.have.length(4);

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    for (let i = 0; i < 4; i += 1) {
      const expectedDate = adapter.addDays(start, i);
      expect(days[i].value).to.toEqualDateTime(expectedDate);
    }
  });

  it('should generate a 7-day range when amount="week"', () => {
    const days = testHook(DEFAULT_TESTING_VISIBLE_DATE, 'week');

    expect(days).to.have.length(7);

    const start = adapter.startOfDay(DEFAULT_TESTING_VISIBLE_DATE);
    for (let i = 0; i < 7; i += 1) {
      const expectedDate = adapter.addDays(start, i);
      expect(days[i].value).to.toEqualDateTime(expectedDate);
    }
  });

  it('should exclude weekends when excludeWeekends=true', () => {
    const days = testHook(DEFAULT_TESTING_VISIBLE_DATE, 'week', true);

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
