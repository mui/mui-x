import { renderHook } from '@mui/internal-test-utils';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { useWeekList } from './useWeekList';
import { SchedulerValidDate } from '../models';

describe('useWeekList', () => {
  function testHook(date: SchedulerValidDate, amount: number | 'end-of-month') {
    const { result } = renderHook(() => useWeekList());
    return result.current({ date: adapter.date(date, 'default'), amount });
  }

  it('should throw an error when amount is a non positive number', () => {
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, 0)).to.throw(/amount.*positive number/);
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, -2)).to.throw(/amount.*positive number/);
  });

  it('should return one week when amount=1', () => {
    const weeks = testHook(DEFAULT_TESTING_VISIBLE_DATE, 1);

    expect(weeks).to.have.length(1);

    const start = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    expect(weeks[0]).to.toEqualDateTime(start);
  });

  it('should return the correct number of consecutive weeks', () => {
    const weeks = testHook(DEFAULT_TESTING_VISIBLE_DATE, 4);

    expect(weeks).to.have.length(4);

    const start = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    for (let i = 0; i < 4; i += 1) {
      expect(weeks[i]).to.toEqualDateTime(adapter.addWeeks(start, i));
    }
  });

  it('should compute end correctly when amount=end-of-month', () => {
    const start = adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE);
    const endOfMonth = adapter.endOfMonth(DEFAULT_TESTING_VISIBLE_DATE);
    const lastWeekStart = adapter.startOfWeek(endOfMonth);

    const weeks = testHook(DEFAULT_TESTING_VISIBLE_DATE, 'end-of-month');

    expect(weeks[0]).to.toEqualDateTime(start);
    expect(weeks[weeks.length - 1]).to.toEqualDateTime(lastWeekStart);
  });
});
