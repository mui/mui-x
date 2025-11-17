import { renderHook } from '@mui/internal-test-utils';
import {
  adapter,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { useMonthList } from './useMonthList';
import { processDate } from '../process-date';

describe('useMonthList', () => {
  function testHook(date: string, amount: number | 'end-of-year') {
    const { result } = renderHook(() => useMonthList());
    return result.current({ date: adapter.date(date), amount });
  }

  it('should throw an error when amount is a non positive number', () => {
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE_STR, 0)).to.throw(/amount.*positive number/);
    expect(() => testHook(DEFAULT_TESTING_VISIBLE_DATE_STR, -3)).to.throw(
      /amount.*positive number/,
    );
  });

  it('should return one month when amount=1', () => {
    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE_STR, 1);

    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);
    const expected = processDate(start, adapter);

    expect(months).to.have.length(1);
    expect(months[0]).to.toEqualDateTime(expected);
  });

  it('should return consecutive months', () => {
    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE_STR, 4);

    expect(months).to.have.length(4);

    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);

    for (let i = 0; i < 4; i += 1) {
      const rawMonth = adapter.addMonths(start, i);
      const expected = processDate(rawMonth, adapter);

      expect(months[i]).to.toEqualDateTime(expected);
    }
  });

  it('should compute end correctly when amount=end-of-year', () => {
    const start = adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE);
    const endOfYear = adapter.endOfYear(DEFAULT_TESTING_VISIBLE_DATE);
    const lastMonthStart = adapter.startOfMonth(endOfYear);

    const months = testHook(DEFAULT_TESTING_VISIBLE_DATE_STR, 'end-of-year');

    expect(months[0]).to.toEqualDateTime(processDate(start, adapter));

    const last = months[months.length - 1];
    const expectedLast = processDate(lastMonthStart, adapter);

    expect(last).to.toEqualDateTime(expectedLast);
  });
});
