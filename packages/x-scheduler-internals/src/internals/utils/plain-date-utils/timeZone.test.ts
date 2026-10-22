import { describe, it, expect } from 'vitest';
import { setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { PlainDate } from '../base-temporal/PlainDate';
import {
  getEndOfDayMs,
  getStartOfDayMs,
  getTimezoneOffsetMs,
  toEpochMs,
  toPlainDateTime,
} from './timeZone';

const HOUR = 3_600_000;

function epochMsOf(date: string, time: string, timezone: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(
    toEpochMs(PlainDate.from({ year, month, day }), (hours * 60 + minutes) * 60_000, timezone),
  ).toISOString();
}

describe('timeZone', () => {
  describe('getTimezoneOffsetMs', () => {
    it('should read IANA offsets, with and without DST', () => {
      expect(getTimezoneOffsetMs('America/New_York', Date.UTC(2025, 0, 15))).to.equal(-5 * HOUR);
      expect(getTimezoneOffsetMs('America/New_York', Date.UTC(2025, 6, 15))).to.equal(-4 * HOUR);
      expect(getTimezoneOffsetMs('Asia/Kolkata', Date.UTC(2025, 0, 15))).to.equal(5.5 * HOUR);
      expect(getTimezoneOffsetMs('Europe/London', Date.UTC(2025, 0, 15))).to.equal(0);
      expect(getTimezoneOffsetMs('UTC', Date.UTC(2025, 0, 15))).to.equal(0);
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)('should read the system offset for the default timezone', () => {
      setSystemTimezone('Australia/Lord_Howe');
      // +11:00 in DST, +10:30 otherwise.
      expect(getTimezoneOffsetMs('default', Date.UTC(2025, 0, 15))).to.equal(11 * HOUR);
      expect(getTimezoneOffsetMs('system', Date.UTC(2025, 6, 15))).to.equal(10.5 * HOUR);
    });
  });

  describe('toPlainDateTime', () => {
    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should keep the seconds of a local mean time offset of the system timezone',
      () => {
        // Paris used +00:09:21 until 1911.
        setSystemTimezone('Europe/Paris');
        const { date, msInDay } = toPlainDateTime(new Date(1890, 0, 1).getTime(), 'default');
        expect(date.toString()).to.equal('1890-01-01');
        expect(msInDay).to.equal(0);

        // Years 0 to 99 aren't remapped to the 1900s.
        const year99 = new Date(1890, 0, 1);
        year99.setFullYear(99);
        expect(toPlainDateTime(year99.getTime(), 'system').date.toString()).to.equal('0099-01-01');
      },
    );

    it('should read the date and wall-clock time in the timezone', () => {
      const { date, msInDay } = toPlainDateTime(Date.UTC(2025, 2, 3, 0, 30), 'America/Los_Angeles');
      expect(date.toString()).to.equal('2025-03-02');
      expect(msInDay).to.equal((16 * 60 + 30) * 60_000);
    });
  });

  describe('toEpochMs', () => {
    it('should resolve a wall-clock time outside DST transitions', () => {
      expect(epochMsOf('2025-07-04', '09:00', 'America/New_York')).to.equal(
        '2025-07-04T13:00:00.000Z',
      );
    });

    it('should move a time skipped by a DST transition forward by the length of the gap', () => {
      expect(epochMsOf('2025-03-09', '02:30', 'America/New_York')).to.equal(
        '2025-03-09T07:30:00.000Z', // 03:30 EDT
      );
      // 30-minute gap
      expect(epochMsOf('2025-10-05', '02:15', 'Australia/Lord_Howe')).to.equal(
        '2025-10-04T15:45:00.000Z', // 02:45 +11:00
      );
      // Gap at midnight
      expect(epochMsOf('2026-03-08', '00:00', 'America/Havana')).to.equal(
        '2026-03-08T05:00:00.000Z', // 01:00 CDT
      );
    });

    it('should resolve a time repeated by a DST transition to its earlier instant', () => {
      expect(epochMsOf('2025-11-02', '01:30', 'America/New_York')).to.equal(
        '2025-11-02T05:30:00.000Z', // 01:30 EDT
      );
      expect(epochMsOf('2026-10-25', '02:30', 'Europe/Paris')).to.equal(
        '2026-10-25T00:30:00.000Z', // 02:30 CEST
      );
    });

    it('should round-trip with toPlainDateTime outside DST transitions', () => {
      const epochMs = Date.UTC(2025, 4, 20, 17, 45, 12, 345);
      for (const timezone of ['default', 'UTC', 'Europe/Paris', 'Asia/Kathmandu', 'Pacific/Apia']) {
        const { date, msInDay } = toPlainDateTime(epochMs, timezone);
        expect(toEpochMs(date, msInDay, timezone)).to.equal(epochMs);
      }
    });
  });

  describe('getStartOfDayMs and getEndOfDayMs', () => {
    const bounds = (iso: string, timezone: string) => {
      const epochMs = new Date(iso).getTime();
      return [getStartOfDayMs(epochMs, timezone), getEndOfDayMs(epochMs, timezone)].map((ms) =>
        new Date(ms).toISOString(),
      );
    };

    it('should return the first and last instants of the day in the timezone', () => {
      expect(bounds('2025-07-04T02:00:00Z', 'America/New_York')).to.deep.equal([
        '2025-07-03T04:00:00.000Z',
        '2025-07-04T03:59:59.999Z',
      ]);
    });

    it('should start a day whose midnight a DST transition skips at the end of the gap', () => {
      // America/Havana springs forward from 00:00 to 01:00 on March 8th, 2026.
      expect(bounds('2026-03-08T12:00:00Z', 'America/Havana')[0]).to.equal(
        '2026-03-08T05:00:00.000Z', // 01:00 CDT
      );
    });

    it('should end a day whose last hour a DST transition repeats on the later 23:59:59.999', () => {
      // America/Santiago falls back from 00:00 -03:00 to 23:00 -04:00 on April 6th, 2024.
      expect(bounds('2024-04-06T12:00:00Z', 'America/Santiago')[1]).to.equal(
        '2024-04-07T03:59:59.999Z', // 23:59:59.999 -04:00
      );
      // Asia/Beirut falls back from 00:00 +03:00 to 23:00 +02:00 on October 26th, 2024.
      expect(bounds('2024-10-26T12:00:00Z', 'Asia/Beirut')[1]).to.equal(
        '2024-10-26T21:59:59.999Z', // 23:59:59.999 +02:00
      );
    });

    it('should end the day before a day the timezone skips when the skipped day starts', () => {
      // Pacific/Apia skipped December 30th, 2011, going from -10:00 to +14:00.
      expect(bounds('2011-12-29T12:00:00Z', 'Pacific/Apia')[1]).to.equal(
        '2011-12-30T09:59:59.999Z', // December 29th, 23:59:59.999 -10:00
      );
    });
  });
});
