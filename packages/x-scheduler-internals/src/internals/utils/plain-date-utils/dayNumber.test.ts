import { describe, it, expect } from 'vitest';
import {
  addMonthsToDayNumber,
  dayNumberToIsoDate,
  getStartOfMonthDayNumber,
  getStartOfWeekDayNumber,
  getStartOfYearDayNumber,
  isoDateToDayNumber,
  LAST_SUPPORTED_DAY,
  MS_PER_DAY,
} from './dayNumber';

// The UTC midnight of an ISO date. `Date.UTC()` reads the years 0 to 99 as 1900 to 1999.
function getUtcMidnight(year: number, month: number, day: number) {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}

describe('dayNumber', () => {
  describe('isoDateToDayNumber and dayNumberToIsoDate', () => {
    it('should count the days from January 1st, 1970, like Date', () => {
      const checkDay = (dayNumber: number) => {
        const isoDate = dayNumberToIsoDate(dayNumber);
        if (getUtcMidnight(isoDate.year, isoDate.month, isoDate.day) !== dayNumber * MS_PER_DAY) {
          throw new Error(`Day ${dayNumber} reads as ${JSON.stringify(isoDate)}.`);
        }
        if (isoDateToDayNumber(isoDate.year, isoDate.month, isoDate.day) !== dayNumber) {
          throw new Error(`Day ${dayNumber} doesn't round trip.`);
        }
      };
      // Every day of the years 0 to 9999, then every 9973rd day of `Date`, a prime step.
      const lastDayOf9999 = isoDateToDayNumber(9999, 12, 31);
      for (
        let dayNumber = isoDateToDayNumber(0, 1, 1);
        dayNumber <= lastDayOf9999;
        dayNumber += 1
      ) {
        checkDay(dayNumber);
      }
      for (
        let dayNumber = -LAST_SUPPORTED_DAY;
        dayNumber <= LAST_SUPPORTED_DAY;
        dayNumber += 9973
      ) {
        checkDay(dayNumber);
      }
      checkDay(LAST_SUPPORTED_DAY);
      expect(isoDateToDayNumber(1970, 1, 1)).to.equal(0);
      expect(dayNumberToIsoDate(-1)).to.deep.equal({ year: 1969, month: 12, day: 31 });
      expect(dayNumberToIsoDate(LAST_SUPPORTED_DAY)).to.deep.equal({
        year: 275760,
        month: 9,
        day: 13,
      });
      expect(isoDateToDayNumber(-271821, 4, 20)).to.equal(-LAST_SUPPORTED_DAY);
    });
  });

  describe('getStartOfWeekDayNumber', () => {
    // Wednesday, January 8th, 2025.
    const wednesday = isoDateToDayNumber(2025, 1, 8);

    it('should go back to the ISO weekday the weeks start on', () => {
      expect(getStartOfWeekDayNumber(wednesday, 1)).to.equal(isoDateToDayNumber(2025, 1, 6));
      expect(getStartOfWeekDayNumber(wednesday, 3)).to.equal(wednesday);
      expect(getStartOfWeekDayNumber(wednesday, 6)).to.equal(isoDateToDayNumber(2025, 1, 4));
      expect(getStartOfWeekDayNumber(wednesday, 7)).to.equal(isoDateToDayNumber(2025, 1, 5));
    });

    it('should read the weekdays of the days before 1970', () => {
      // Sunday, December 31st, 1899.
      const sunday = isoDateToDayNumber(1899, 12, 31);
      expect(getStartOfWeekDayNumber(sunday, 7)).to.equal(sunday);
      expect(getStartOfWeekDayNumber(sunday, 1)).to.equal(sunday - 6);
    });
  });

  describe('getStartOfMonthDayNumber', () => {
    it('should return the first day of the month', () => {
      expect(getStartOfMonthDayNumber(isoDateToDayNumber(2024, 2, 29))).to.equal(
        isoDateToDayNumber(2024, 2, 1),
      );
      expect(getStartOfMonthDayNumber(isoDateToDayNumber(1969, 12, 31))).to.equal(
        isoDateToDayNumber(1969, 12, 1),
      );
    });
  });

  describe('getStartOfYearDayNumber', () => {
    it('should return the first day of the year', () => {
      expect(getStartOfYearDayNumber(isoDateToDayNumber(2024, 12, 31))).to.equal(
        isoDateToDayNumber(2024, 1, 1),
      );
      expect(getStartOfYearDayNumber(isoDateToDayNumber(1969, 3, 1))).to.equal(
        isoDateToDayNumber(1969, 1, 1),
      );
    });
  });

  describe('addMonthsToDayNumber', () => {
    it('should keep the day of the month, or the last day of a shorter month', () => {
      const january31 = isoDateToDayNumber(2024, 1, 31);
      expect(addMonthsToDayNumber(january31, 1)).to.equal(isoDateToDayNumber(2024, 2, 29));
      expect(addMonthsToDayNumber(january31, 13)).to.equal(isoDateToDayNumber(2025, 2, 28));
      expect(addMonthsToDayNumber(january31, -2)).to.equal(isoDateToDayNumber(2023, 11, 30));
      expect(addMonthsToDayNumber(isoDateToDayNumber(2024, 3, 15), 0)).to.equal(
        isoDateToDayNumber(2024, 3, 15),
      );
    });
  });
});
