import { describe, it, expect } from 'vitest';
import { createDate, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { processDate } from '../../../process-date';
import { createDateFromWallTime, createProcessedDate, isInstantString } from './date';
import { toPlainDate } from './timeZone';

/**
 * The date and the minutes of the day of an instant in `timezone`, as the getters of `Date` read
 * them for the timezone of the system and `Intl.DateTimeFormat` for the others: the reference the
 * plain dates and the processed dates are checked against.
 */
function readReference(epochMs: number, timezone: string) {
  const date = new Date(epochMs);
  if (timezone === 'default') {
    return {
      key: [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((field, index) => String(field).padStart(index === 0 ? 4 : 2, '0'))
        .join('-'),
      minutesInDay: date.getHours() * 60 + date.getMinutes(),
    };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)!.value;
  return {
    key: `${read('year')}-${read('month')}-${read('day')}`,
    minutesInDay: Number(read('hour')) * 60 + Number(read('minute')),
  };
}

describe('plain-date-utils/date', () => {
  it('should build the plain date of a value in a timezone', () => {
    // 2025-03-03T00:30Z is March 2nd in Los Angeles.
    const value = createDate('2025-03-03T00:30:00Z');
    const plainDate = toPlainDate(value.getTime(), 'America/Los_Angeles');
    expect(plainDate.toString()).to.equal('2025-03-02');
  });

  // The instants around DST transitions, the transitions at midnight and the day Apia skipped.
  const INSTANTS = [
    '2026-03-08T04:30:00Z',
    '2026-03-08T05:30:00Z',
    '2026-04-05T03:30:00Z',
    '2026-04-05T15:30:00Z',
    '2026-10-25T00:30:00Z',
    '2026-10-25T01:30:00Z',
    '2011-12-30T09:59:59Z',
    '2011-12-30T10:00:00Z',
  ];

  it('should build the date Intl reads in the timezone', () => {
    for (const timezone of [
      'UTC',
      'America/New_York',
      'America/Havana',
      'America/St_Johns',
      'America/Santiago',
      'Europe/Paris',
      'Asia/Kolkata',
      'Australia/Lord_Howe',
      'Pacific/Apia',
    ]) {
      for (const instant of INSTANTS) {
        const value = createDate(instant);
        expect(
          toPlainDate(value.getTime(), timezone).toString(),
          `${instant} in ${timezone}`,
        ).to.equal(readReference(value.getTime(), timezone).key);
      }
    }
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)(
    'should build the date the getters of Date read in the timezone of the system',
    () => {
      setSystemTimezone('Australia/Lord_Howe');
      for (const instant of INSTANTS) {
        const value = createDate(instant);
        expect(toPlainDate(value.getTime(), 'default').toString(), instant).to.equal(
          readReference(value.getTime(), 'default').key,
        );
      }
    },
  );

  it.each(['default', 'UTC', 'America/New_York', 'Asia/Kolkata'])(
    'should process a date in %s like the reference reads it',
    (timezone) => {
      const epochMs = Date.UTC(2025, 10, 2, 5, 30);
      const value = new Date(epochMs);
      // A plain `Date`, not a subclass carrying a timezone.
      expect(value.constructor).to.equal(Date);
      expect(value.getTime()).to.equal(epochMs);

      const { value: processedValue, ...processed } = processDate(value, timezone);
      expect(processedValue).to.equal(value);
      expect(processed).to.deep.equal({ ...readReference(epochMs, timezone), timestamp: epochMs });
      const { value: createdValue, ...created } = createProcessedDate(epochMs, timezone);
      expect(createdValue.constructor).to.equal(Date);
      expect(created).to.deep.equal({ ...readReference(epochMs, timezone), timestamp: epochMs });
    },
  );

  it('should process a date with an offset between -01:00 and 00:00', () => {
    // Africa/Monrovia used -00:44:30 until 1972: the epoch is 23:15:30 on December 31st, 1969.
    const { value, ...processed } = createProcessedDate(0, 'Africa/Monrovia');
    expect(processed).to.deep.equal({
      key: '1969-12-31',
      timestamp: 0,
      minutesInDay: 23 * 60 + 15,
    });
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM).each(['America/New_York', 'Australia/Lord_Howe', 'Asia/Kolkata'])(
    'should process a date like the getters of Date read it in the system timezone %s',
    (systemTimezone) => {
      setSystemTimezone(systemTimezone);
      // 01:30 in New York, on the day it falls back, and 16:30 in Lord Howe.
      const epochMs = Date.UTC(2025, 10, 2, 5, 30);
      const reference = { ...readReference(epochMs, 'default'), timestamp: epochMs };

      const { value: processedValue, ...processed } = processDate(new Date(epochMs), 'default');
      expect(processed).to.deep.equal(reference);
      const { value: createdValue, ...created } = createProcessedDate(epochMs, 'default');
      expect(created).to.deep.equal(reference);
    },
  );

  describe('isInstantString', () => {
    it.each([
      '2025-01-01T09:00:00Z',
      '2025-01-01T09:00:00-05:00',
      '2025-01-01T09:00:00-03:30',
      '2025-01-01T09:00:00+0200',
      '2025-01-01T09:00:00.000+01:00',
      '2025-01-01t09:00:00z',
    ])('should read %s as an instant', (value) => {
      expect(isInstantString(value)).to.equal(true);
    });

    it.each(['2025-01-01T09:00:00', '2025-01-01', '2025/01/01', '+02'])(
      'should read %s as a wall-clock time',
      (value) => {
        expect(isInstantString(value)).to.equal(false);
      },
    );
  });

  describe('createDateFromWallTime', () => {
    const resolve = (value: string, timezone: string) => {
      const date = createDateFromWallTime(value, timezone);
      return date === null ? null : date.toISOString();
    };

    it('should read dates and times with or without seconds and milliseconds', () => {
      expect(resolve('2025-01-01', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
      expect(resolve('2025-01-01T09:30', 'America/New_York')).to.equal('2025-01-01T14:30:00.000Z');
      expect(resolve('2025-01-01T09:30:15.5', 'UTC')).to.equal('2025-01-01T09:30:15.500Z');
      expect(resolve('2025-01-01T09:30:00', 'Asia/Tokyo')).to.equal('2025-01-01T00:30:00.000Z');
    });

    it('should read the years and the months at midnight of their first day', () => {
      expect(resolve('2025-01', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
      expect(resolve('2025', 'America/New_York')).to.equal('2025-01-01T05:00:00.000Z');
      expect(resolve('2025-02T09:30', 'America/New_York')).to.equal('2025-02-01T14:30:00.000Z');
    });

    it('should move the dates and times above their range forward, like Date', () => {
      expect(resolve('2025-02-30T09:00', 'UTC')).to.equal('2025-03-02T09:00:00.000Z');
      expect(resolve('2025-01-01T24:00', 'UTC')).to.equal('2025-01-02T00:00:00.000Z');
    });

    it('should return null for other formats and for unknown timezones', () => {
      expect(resolve('2025-01-01T09:00:00+02:00', 'UTC')).to.equal(null);
      expect(resolve('2025-01-01 09:00', 'UTC')).to.equal(null);
      expect(resolve('20250101', 'UTC')).to.equal(null);
      expect(resolve('2025-01-01T09:00', 'Not/A_Timezone')).to.equal(null);
    });
  });
});
