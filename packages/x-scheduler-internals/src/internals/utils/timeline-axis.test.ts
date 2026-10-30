import { adapter, createTimelineAxis, setSystemTimezone } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import {
  getPlainDateTimelineAxis,
  getTimelineAxisDurationMs,
  timelineAxisOffsetToTimestamp,
  timestampToTimelineAxisOffsetMs,
  isStartMinuteOutsideAxisWindow,
  isEndMinuteOutsideAxisWindow,
} from './timeline-axis';
import { BaseTemporal } from './base-temporal';

const MINUTE = 60_000;

describe('timeline-axis', () => {
  const start = adapter.date('2025-01-05T00:00:00.000Z', 'UTC');
  const end = adapter.endOfDay(adapter.date('2025-01-08T00:00:00.000Z', 'UTC'));

  const fullAxis = createTimelineAxis({ start, end, dayStartMinute: 0, dayEndMinute: 1440 });
  // Window 8:00 → 20:00: 720 visible minutes per day.
  const trimmedAxis = createTimelineAxis({ start, end, dayStartMinute: 480, dayEndMinute: 1200 });

  describe('getPlainDateTimelineAxis', () => {
    const getBounds = (
      dayStartMinute: number,
      dayEndMinute: number,
      date = '2025-07-03',
      timezone = 'UTC',
    ) => {
      const axis = getPlainDateTimelineAxis(
        BaseTemporal.PlainDate.from(date),
        { dayStartMinute, dayEndMinute },
        timezone,
      );
      return [new Date(axis.start).toISOString(), new Date(axis.end).toISOString()];
    };

    it('should end a window that runs to the end of the day on the last instant of the date', () => {
      expect(getBounds(0, 1440)).to.deep.equal([
        '2025-07-03T00:00:00.000Z',
        '2025-07-03T23:59:59.999Z',
      ]);
      expect(getBounds(120, 1440)).to.deep.equal([
        '2025-07-03T02:00:00.000Z',
        '2025-07-03T23:59:59.999Z',
      ]);
    });

    it('should end a window that stops before the end of the day on its exclusive end', () => {
      expect(getBounds(480, 1200)).to.deep.equal([
        '2025-07-03T08:00:00.000Z',
        '2025-07-03T20:00:00.000Z',
      ]);
    });

    it('should bound the days that a DST transition shortens or lengthens', () => {
      // New York springs forward on March 8th, 2026 (23 hours) and falls back on November 2nd,
      // 2025 (25 hours).
      expect(getBounds(0, 1440, '2026-03-08', 'America/New_York')).to.deep.equal([
        '2026-03-08T05:00:00.000Z',
        '2026-03-09T03:59:59.999Z',
      ]);
      expect(getBounds(0, 1440, '2025-11-02', 'America/New_York')).to.deep.equal([
        '2025-11-02T04:00:00.000Z',
        '2025-11-03T04:59:59.999Z',
      ]);
    });

    it('should start a window on a skipped time at the end of the gap', () => {
      // 02:00 doesn't exist in New York on March 8th, 2026: the window starts at 03:00 EDT.
      expect(getBounds(120, 1200, '2026-03-08', 'America/New_York')).to.deep.equal([
        '2026-03-08T07:00:00.000Z',
        '2026-03-09T00:00:00.000Z',
      ]);
    });

    it('should return the axis of the window in the timezone', () => {
      const axis = getPlainDateTimelineAxis(
        BaseTemporal.PlainDate.from('2025-07-03'),
        { dayStartMinute: 480, dayEndMinute: 1200 },
        'Europe/Paris',
      );
      expect(axis).to.include({
        timezone: 'Europe/Paris',
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });
    });
  });

  describe('getTimelineAxisDurationMs', () => {
    it('should return days × 1440 minutes for the full-day window', () => {
      expect(getTimelineAxisDurationMs(fullAxis)).to.equal(4 * 1440 * MINUTE);
    });

    it('should return days × visible minutes for a trimmed window', () => {
      expect(getTimelineAxisDurationMs(trimmedAxis)).to.equal(4 * 720 * MINUTE);
    });
  });

  describe('timelineAxisOffsetToTimestamp', () => {
    it('should add the offset to the start for the full-day window', () => {
      expect(timelineAxisOffsetToTimestamp(fullAxis, 26 * 60 * MINUTE)).to.equal(
        Date.UTC(2025, 0, 6, 2),
      );
    });

    it('should map an offset inside a later day of a trimmed window', () => {
      // 840 axis minutes = 1 full visible day (720) + 120 → Jan 6, 08:00 + 2h.
      expect(timelineAxisOffsetToTimestamp(trimmedAxis, 840 * MINUTE)).to.equal(
        Date.UTC(2025, 0, 6, 10),
      );
    });

    it('should map the day seam to the start of the next visible day', () => {
      expect(timelineAxisOffsetToTimestamp(trimmedAxis, 720 * MINUTE)).to.equal(
        Date.UTC(2025, 0, 6, 8),
      );
    });

    it('should extend the piecewise axis into the previous day for a negative offset', () => {
      expect(timelineAxisOffsetToTimestamp(trimmedAxis, -60 * MINUTE)).to.equal(
        Date.UTC(2025, 0, 4, 19),
      );
    });

    it('should return NaN for a non-finite offset', () => {
      expect(Number.isNaN(timelineAxisOffsetToTimestamp(fullAxis, NaN))).to.equal(true);
      expect(Number.isNaN(timelineAxisOffsetToTimestamp(fullAxis, Infinity))).to.equal(true);
    });
  });

  describe('timestampToTimelineAxisOffsetMs', () => {
    it('should return the real ms difference for the full-day window', () => {
      const date = adapter.date('2025-01-06T02:00:00.000Z', 'UTC');
      expect(timestampToTimelineAxisOffsetMs(fullAxis, adapter.getTime(date))).to.equal(
        26 * 60 * MINUTE,
      );
    });

    it('should map a date inside the window of a trimmed axis', () => {
      const date = adapter.date('2025-01-06T10:00:00.000Z', 'UTC');
      expect(timestampToTimelineAxisOffsetMs(trimmedAxis, adapter.getTime(date))).to.equal(
        840 * MINUTE,
      );
    });

    it('should clamp a date outside the visible window to the day edge', () => {
      const hidden = adapter.date('2025-01-05T22:00:00.000Z', 'UTC');
      expect(timestampToTimelineAxisOffsetMs(trimmedAxis, adapter.getTime(hidden))).to.equal(
        720 * MINUTE,
      );
    });

    it('should return a negative offset for a date before the collection start', () => {
      const date = adapter.date('2025-01-04T10:00:00.000Z', 'UTC');
      expect(timestampToTimelineAxisOffsetMs(trimmedAxis, adapter.getTime(date))).to.equal(
        -600 * MINUTE,
      );
    });

    it('should round-trip with timelineAxisOffsetToTimestamp inside the window', () => {
      const date = adapter.date('2025-01-07T15:30:00.000Z', 'UTC');
      const offset = timestampToTimelineAxisOffsetMs(trimmedAxis, adapter.getTime(date));
      expect(timelineAxisOffsetToTimestamp(trimmedAxis, offset)).to.equal(adapter.getTime(date));
    });
  });

  describe('DST transitions', () => {
    // Nov 2 2025 in America/New_York: clocks fall back at 02:00, the day lasts 25 hours.
    const dstStart = adapter.date('2025-11-02T00:00:00', 'America/New_York');
    const dstEnd = adapter.endOfDay(adapter.addDays(dstStart, 1));

    it('should map an offset to the wall-clock hour even after a fall-back transition', () => {
      const axis = createTimelineAxis({
        start: dstStart,
        end: dstEnd,
        dayStartMinute: 0,
        dayEndMinute: 720,
      });
      // 480 axis minutes = the "08:00" column: wall-clock 08:00, not midnight + 480 real
      // minutes (which is 07:00 after the extra hour).
      const timestamp = timelineAxisOffsetToTimestamp(axis, 480 * MINUTE);
      expect(new Date(timestamp).toISOString()).to.equal('2025-11-02T13:00:00.000Z'); // 08:00 EST
    });

    it('should round-trip px↔date across a fall-back transition', () => {
      const axis = createTimelineAxis({
        start: dstStart,
        end: dstEnd,
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });
      const date = adapter.date('2025-11-02T10:00:00', 'America/New_York');
      const offset = timestampToTimelineAxisOffsetMs(axis, adapter.getTime(date));
      expect(offset).to.equal(120 * MINUTE);
      expect(timelineAxisOffsetToTimestamp(axis, offset)).to.equal(adapter.getTime(date));
    });

    it('should round-trip px↔date across a spring-forward transition', () => {
      // Mar 8 2026: clocks spring forward at 02:00, the day lasts 23 hours.
      const springStart = adapter.date('2026-03-08T00:00:00', 'America/New_York');
      const axis = createTimelineAxis({
        start: springStart,
        end: adapter.endOfDay(adapter.addDays(springStart, 1)),
        dayStartMinute: 480,
        dayEndMinute: 1200,
      });
      const date = adapter.date('2026-03-08T10:00:00', 'America/New_York');
      const offset = timestampToTimelineAxisOffsetMs(axis, adapter.getTime(date));
      expect(offset).to.equal(120 * MINUTE);
      expect(timelineAxisOffsetToTimestamp(axis, offset)).to.equal(adapter.getTime(date));
    });

    it('should resolve an offset inside the spring-forward gap to the next existing hour', () => {
      // 02:00 does not exist on Mar 8 2026: the offset resolves to 03:00 and does not
      // round-trip (known limitation, documented on `timelineAxisOffsetToTimestamp`).
      const springStart = adapter.date('2026-03-08T00:00:00', 'America/New_York');
      const axis = createTimelineAxis({
        start: springStart,
        end: adapter.endOfDay(springStart),
        dayStartMinute: 0,
        dayEndMinute: 1440,
      });
      const timestamp = timelineAxisOffsetToTimestamp(axis, 120 * MINUTE);
      expect(new Date(timestamp).toISOString()).to.equal('2026-03-08T07:00:00.000Z'); // 03:00 EDT
      expect(timestampToTimelineAxisOffsetMs(axis, timestamp)).to.equal(180 * MINUTE);
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should resolve an offset inside the hour repeated by a fall-back transition to its first instant, whatever the timezone of the system',
      () => {
        // Europe/Paris falls back from 03:00 to 02:00 on October 25th, 2026.
        setSystemTimezone('America/New_York');
        const parisStart = adapter.date('2026-10-25T00:00:00', 'Europe/Paris');
        const axis = createTimelineAxis({
          start: parisStart,
          end: adapter.endOfDay(parisStart),
          dayStartMinute: 0,
          dayEndMinute: 1440,
        });
        const timestamp = timelineAxisOffsetToTimestamp(axis, 150 * MINUTE);
        expect(new Date(timestamp).toISOString()).to.equal('2026-10-25T00:30:00.000Z'); // 02:30 CEST
      },
    );
  });

  describe('isStartMinuteOutsideAxisWindow', () => {
    // The day seam is ambiguous: day d at `dayEndMinute` and day d+1 at `dayStartMinute`
    // render at the same axis offset. A start bound on the seam belongs to the next day,
    // so the exclusive end minute itself is outside the window.
    it('should classify the minutes around a trimmed window', () => {
      const axis = { start, end, dayStartMinute: 480, dayEndMinute: 1200 };
      expect(isStartMinuteOutsideAxisWindow(axis, 479)).to.equal(true);
      expect(isStartMinuteOutsideAxisWindow(axis, 480)).to.equal(false);
      expect(isStartMinuteOutsideAxisWindow(axis, 1199)).to.equal(false);
      expect(isStartMinuteOutsideAxisWindow(axis, 1200)).to.equal(true);
      expect(isStartMinuteOutsideAxisWindow(axis, 1201)).to.equal(true);
    });

    it('should treat midnight as outside a window starting after midnight', () => {
      const axis = { start, end, dayStartMinute: 480, dayEndMinute: 1440 };
      expect(isStartMinuteOutsideAxisWindow(axis, 0)).to.equal(true);
      expect(isStartMinuteOutsideAxisWindow(axis, 1439)).to.equal(false);
    });

    it('should never clip a start on the full-day window', () => {
      expect(isStartMinuteOutsideAxisWindow(fullAxis, 0)).to.equal(false);
      expect(isStartMinuteOutsideAxisWindow(fullAxis, 1439)).to.equal(false);
    });
  });

  describe('isEndMinuteOutsideAxisWindow', () => {
    // An end bound at midnight is minute 0 of the next day, but it closes the previous
    // day: it must be measured as minute 1440 against that day's window.
    it('should classify the minutes around a trimmed window', () => {
      const axis = { start, end, dayStartMinute: 480, dayEndMinute: 1200 };
      expect(isEndMinuteOutsideAxisWindow(axis, 480)).to.equal(true);
      expect(isEndMinuteOutsideAxisWindow(axis, 481)).to.equal(false);
      expect(isEndMinuteOutsideAxisWindow(axis, 1200)).to.equal(false);
      expect(isEndMinuteOutsideAxisWindow(axis, 1201)).to.equal(true);
      expect(isEndMinuteOutsideAxisWindow(axis, 0)).to.equal(true);
    });

    it('should keep an end at midnight inside a window ending at midnight', () => {
      const axis = { start, end, dayStartMinute: 480, dayEndMinute: 1440 };
      expect(isEndMinuteOutsideAxisWindow(axis, 0)).to.equal(false);
      expect(isEndMinuteOutsideAxisWindow(axis, 480)).to.equal(true);
    });

    it('should treat an end at midnight as outside a morning window', () => {
      const axis = { start, end, dayStartMinute: 0, dayEndMinute: 720 };
      expect(isEndMinuteOutsideAxisWindow(axis, 0)).to.equal(true);
      expect(isEndMinuteOutsideAxisWindow(axis, 720)).to.equal(false);
    });

    it('should never clip an end on the full-day window', () => {
      expect(isEndMinuteOutsideAxisWindow(fullAxis, 0)).to.equal(false);
      expect(isEndMinuteOutsideAxisWindow(fullAxis, 1439)).to.equal(false);
    });
  });
});
