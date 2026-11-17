import { describe, it, expect } from 'vitest';
import { BaseTemporal } from '@mui/x-scheduler-internals/internals';
import { computeMonthlyOrdinal } from './computeMonthlyOrdinal';

describe('recurring-events/computeMonthlyOrdinal', () => {
  const expectOrdinal = (dateString: string, expected: number) => {
    expect(computeMonthlyOrdinal(BaseTemporal.PlainDate.from(dateString))).to.equal(expected);
  };

  it('returns 1 for the first time that weekday appears in the month', () => {
    expectOrdinal('2025-07-07', 1);
  });

  it('returns 2, 3, 4 for the second, third and fourth time that weekday appears', () => {
    expectOrdinal('2025-07-08', 2);
    expectOrdinal('2025-07-15', 3);
    expectOrdinal('2025-07-22', 4);
  });

  it('returns -1 when the date is the last time that weekday appears in the month', () => {
    expectOrdinal('2025-07-29', -1); // last Tuesday
  });
});
