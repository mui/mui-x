import { describe, it, expect } from 'vitest';
import { BaseTemporal } from '../base-temporal';
import { LAST_SUPPORTED_DAY } from './dayNumber';
import {
  getDayNumber,
  getPlainDateKey,
  isWeekendPlainDate,
  plainDateFromDayNumber,
} from './plainDate';

describe('plainDateFromDayNumber', () => {
  it('should return the plain date of a day number, in the ISO calendar', () => {
    expect(plainDateFromDayNumber(0)).toEqualPlainDate('1970-01-01');
    expect(plainDateFromDayNumber(-1)).toEqualPlainDate('1969-12-31');
    expect(plainDateFromDayNumber(20_000).calendarId).to.equal('iso8601');
  });

  it('should return the same instance for a day number', () => {
    expect(plainDateFromDayNumber(20_000)).to.equal(plainDateFromDayNumber(20_000));
  });

  it('should keep the dates it returned usable once the cache is emptied', () => {
    const plainDate = plainDateFromDayNumber(20_000);

    // More days than the cache holds.
    for (let dayNumber = 0; dayNumber <= 10_000; dayNumber += 1) {
      plainDateFromDayNumber(dayNumber);
    }

    const plainDateAfterClear = plainDateFromDayNumber(20_000);
    expect(plainDateAfterClear).not.to.equal(plainDate);
    expect(plainDateAfterClear.equals(plainDate)).to.equal(true);
    expect(getDayNumber(plainDate)).to.equal(20_000);
  });

  it('should throw for a day outside the supported days', () => {
    expect(plainDateFromDayNumber(LAST_SUPPORTED_DAY)).toEqualPlainDate('+275760-09-13');
    expect(() => plainDateFromDayNumber(LAST_SUPPORTED_DAY + 1)).to.throw();
    expect(plainDateFromDayNumber(-LAST_SUPPORTED_DAY)).toEqualPlainDate('-271821-04-20');
    expect(() => plainDateFromDayNumber(-LAST_SUPPORTED_DAY - 1)).to.throw();
  });
});

describe('getDayNumber', () => {
  it('should return the number of days from January 1st, 1970', () => {
    expect(getDayNumber(BaseTemporal.PlainDate.from('1970-01-01'))).to.equal(0);
    expect(getDayNumber(BaseTemporal.PlainDate.from('1969-12-31'))).to.equal(-1);
    expect(getDayNumber(BaseTemporal.PlainDate.from('2024-02-29'))).to.equal(19_782);
    expect(getDayNumber(plainDateFromDayNumber(20_000))).to.equal(20_000);
  });

  it('should read the dates created by the methods of the plain dates', () => {
    const plainDate = BaseTemporal.PlainDate.from('2024-02-29');
    expect(getDayNumber(plainDate.add({ days: 1 }))).to.equal(19_783);
    expect(getDayNumber(plainDate.with({ day: 1 }))).to.equal(19_754);
  });

  it('should read the ISO date of a date in another calendar', () => {
    // The copy only builds in the ISO and Gregorian calendars.
    const plainDate = BaseTemporal.PlainDate.from('2024-02-29').withCalendar('gregory');
    expect(getDayNumber(plainDate)).to.equal(19_782);
  });
});

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
