import { describe, it, expect } from 'vitest';
import { getPlainDateKey, isWeekendPlainDate, plainDateFromDayNumber } from './plainDate';
import { BaseTemporal } from '../base-temporal';

describe('getPlainDateKey', () => {
  it('should return the ISO date of the day, also once the cache is full', () => {
    const plainDate = BaseTemporal.PlainDate.from('2026-03-07');
    expect(getPlainDateKey(plainDate)).to.equal('2026-03-07');

    // More days than the cache holds.
    for (let dayNumber = 0; dayNumber <= 10_000; dayNumber += 1) {
      getPlainDateKey(plainDateFromDayNumber(dayNumber));
    }

    expect(getPlainDateKey(plainDate)).to.equal('2026-03-07');
    expect(getPlainDateKey(plainDateFromDayNumber(0))).to.equal('1970-01-01');
  });
});

describe('isWeekendPlainDate', () => {
  it('should return false for a weekday', () => {
    expect(isWeekendPlainDate(BaseTemporal.PlainDate.from('2025-01-08'))).to.equal(false); // Wednesday
  });

  it('should return true for Saturday and Sunday', () => {
    expect(isWeekendPlainDate(BaseTemporal.PlainDate.from('2025-01-11'))).to.equal(true);
    expect(isWeekendPlainDate(BaseTemporal.PlainDate.from('2025-01-12'))).to.equal(true);
  });
});
