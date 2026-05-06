import { adapter } from 'test/utils/scheduler';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';

describe('recurring-events/computeMonthlyOrdinal', () => {
  const expectOrdinal = (dateString: string, expected: number) => {
    const date = adapter.date(dateString, 'default');
    expect(computeMonthlyOrdinal(adapter, date)).to.equal(expected);
  };

  it('returns 1 for the first time that weekday appears in the month', () => {
    expectOrdinal('2025-07-07T10:00:00Z', 1);
  });

  it('returns 2, 3, 4 for the second, third and fourth time that weekday appears', () => {
    expectOrdinal('2025-07-08T10:00:00Z', 2);
    expectOrdinal('2025-07-15T10:00:00Z', 3);
    expectOrdinal('2025-07-22T10:00:00Z', 4);
  });

  it('returns -1 when the date is the last time that weekday appears in the month', () => {
    expectOrdinal('2025-07-29T10:00:00Z', -1); // last Tuesday
  });
});
