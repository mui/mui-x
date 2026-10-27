import { describe, it, expect } from 'vitest';
import { PlainDate } from '../base-temporal/PlainDate';
import { getPlainDateKey, plainDateFromDayNumber } from './plainDate';

describe('getPlainDateKey', () => {
  it('should return the ISO date of the day, also once the cache is full', () => {
    const plainDate = PlainDate.from('2026-03-07');
    expect(getPlainDateKey(plainDate)).to.equal('2026-03-07');

    // More days than the cache holds.
    for (let dayNumber = 0; dayNumber <= 10_000; dayNumber += 1) {
      getPlainDateKey(plainDateFromDayNumber(dayNumber));
    }

    expect(getPlainDateKey(plainDate)).to.equal('2026-03-07');
    expect(getPlainDateKey(plainDateFromDayNumber(0))).to.equal('1970-01-01');
  });
});
