import { renderHook } from '@mui/internal-test-utils';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { useMonthList } from './useMonthList';
import { SchedulerValidDate } from '../models';

describe('useMonthList', () => {
  function testHook(date: SchedulerValidDate, amount: number | 'end-of-year') {
    const { result } = renderHook(() => useMonthList());
    return result.current({ date, amount });
  }

  it('should throw an error when amount is a non positive number', () => {
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, 0)).to.throw(/amount.*positive number/);
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE, -3)).to.throw(/amount.*positive number/);
  });

  it('should return one month when amount=1', () => {
    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE, 1);

    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);

    expect(months).to.have.length(1);
    expect(months[0].value).to.toEqualDateTime(start);
  });

  it('should return consecutive months', () => {
    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE, 4);

    expect(months).to.have.length(4);

    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);

    for (let i = 0; i < 4; i += 1) {
      const expectedMonth = adapter.addMonths(start, i);
      expect(months[i].value).to.toEqualDateTime(expectedMonth);
    }
  });

  it('should compute end correctly when amount=end-of-year', () => {
    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);
    const endOfYear = adapter.endOfYear(DEFAULT_TESTING_VISIBLE_DATE);
    const lastMonthStart = adapter.startOfMonth(endOfYear);

    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE, 'end-of-year');

    expect(months[0].value).to.toEqualDateTime(start);
    expect(months[months.length - 1].value).to.toEqualDateTime(lastMonthStart);
  });
});
