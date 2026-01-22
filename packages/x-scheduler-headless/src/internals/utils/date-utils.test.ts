import { adapter } from 'test/utils/scheduler';
import { mergeDateAndTime } from './date-utils';

describe('date-utils', () => {
  describe('mergeDateAndTime', () => {
    it('merges hour/minute/second/ms from timeParam into dateParam', () => {
      const date = adapter.date('2025-03-10T00:00:00Z', 'default');
      const time = adapter.date('2024-12-25T13:45:27.123Z', 'default');
      const merged = mergeDateAndTime(adapter, date, time);
      expect(adapter.getYear(merged)).to.equal(2025);
      expect(adapter.getMonth(merged)).to.equal(2);
      expect(adapter.getDate(merged)).to.equal(10);
      expect(adapter.getHours(merged)).to.equal(13);
      expect(adapter.getMinutes(merged)).to.equal(45);
      expect(adapter.getSeconds(merged)).to.equal(27);
      expect(adapter.getMilliseconds(merged)).to.equal(123);
    });
  });
});
