import { adapter } from 'test/utils/scheduler';
import {
  getTimelineAxisDurationMs,
  timelineAxisOffsetToDate,
  dateToTimelineAxisOffsetMs,
  isRangeVisibleOnTimelineAxis,
  isStartMinuteOutsideAxisWindow,
  isEndMinuteOutsideAxisWindow,
} from './timeline-axis';

const MINUTE = 60_000;

describe('timeline-axis', () => {
  const start = adapter.date('2025-01-05T00:00:00.000Z', 'UTC');
  const end = adapter.endOfDay(adapter.date('2025-01-08T00:00:00.000Z', 'UTC'));

  const fullAxis = { start, end, dayStartMinute: 0, dayEndMinute: 1440 };
  // Window 8:00 → 20:00: 720 visible minutes per day.
  const trimmedAxis = { start, end, dayStartMinute: 480, dayEndMinute: 1200 };

  describe('getTimelineAxisDurationMs', () => {
    it('should return days × 1440 minutes for the full-day window', () => {
      expect(getTimelineAxisDurationMs(adapter, fullAxis)).to.equal(4 * 1440 * MINUTE);
    });

    it('should return days × visible minutes for a trimmed window', () => {
      expect(getTimelineAxisDurationMs(adapter, trimmedAxis)).to.equal(4 * 720 * MINUTE);
    });
  });

  describe('timelineAxisOffsetToDate', () => {
    it('should behave like addMilliseconds for the full-day window', () => {
      const date = timelineAxisOffsetToDate(adapter, fullAxis, 26 * 60 * MINUTE);
      expect(date).toEqualDateTime(adapter.date('2025-01-06T02:00:00.000Z', 'UTC'));
    });

    it('should map an offset inside a later day of a trimmed window', () => {
      // 840 axis minutes = 1 full visible day (720) + 120 → Jan 6, 08:00 + 2h.
      const date = timelineAxisOffsetToDate(adapter, trimmedAxis, 840 * MINUTE);
      expect(date).toEqualDateTime(adapter.date('2025-01-06T10:00:00.000Z', 'UTC'));
    });

    it('should map the day seam to the start of the next visible day', () => {
      const date = timelineAxisOffsetToDate(adapter, trimmedAxis, 720 * MINUTE);
      expect(date).toEqualDateTime(adapter.date('2025-01-06T08:00:00.000Z', 'UTC'));
    });

    it('should extend the piecewise axis into the previous day for a negative offset', () => {
      const date = timelineAxisOffsetToDate(adapter, trimmedAxis, -60 * MINUTE);
      expect(date).toEqualDateTime(adapter.date('2025-01-04T19:00:00.000Z', 'UTC'));
    });
  });

  describe('dateToTimelineAxisOffsetMs', () => {
    it('should return the real ms difference for the full-day window', () => {
      const date = adapter.date('2025-01-06T02:00:00.000Z', 'UTC');
      expect(dateToTimelineAxisOffsetMs(adapter, fullAxis, date)).to.equal(26 * 60 * MINUTE);
    });

    it('should map a date inside the window of a trimmed axis', () => {
      const date = adapter.date('2025-01-06T10:00:00.000Z', 'UTC');
      expect(dateToTimelineAxisOffsetMs(adapter, trimmedAxis, date)).to.equal(840 * MINUTE);
    });

    it('should clamp a date outside the visible window to the day edge', () => {
      const hidden = adapter.date('2025-01-05T22:00:00.000Z', 'UTC');
      expect(dateToTimelineAxisOffsetMs(adapter, trimmedAxis, hidden)).to.equal(720 * MINUTE);
    });

    it('should return a negative offset for a date before the collection start', () => {
      const date = adapter.date('2025-01-04T10:00:00.000Z', 'UTC');
      expect(dateToTimelineAxisOffsetMs(adapter, trimmedAxis, date)).to.equal(-600 * MINUTE);
    });

    it('should round-trip with timelineAxisOffsetToDate inside the window', () => {
      const date = adapter.date('2025-01-07T15:30:00.000Z', 'UTC');
      const offset = dateToTimelineAxisOffsetMs(adapter, trimmedAxis, date);
      expect(timelineAxisOffsetToDate(adapter, trimmedAxis, offset)).toEqualDateTime(date);
    });
  });

  describe('DST transitions', () => {
    // Nov 2 2025 in America/New_York: clocks fall back at 02:00, the day lasts 25 hours.
    const dstStart = adapter.date('2025-11-02T00:00:00', 'America/New_York');
    const dstEnd = adapter.endOfDay(adapter.addDays(dstStart, 1));

    it('should map an offset to the wall-clock hour even after a fall-back transition', () => {
      const axis = { start: dstStart, end: dstEnd, dayStartMinute: 0, dayEndMinute: 720 };
      // 480 axis minutes = the "08:00" column: wall-clock 08:00, not midnight + 480 real
      // minutes (which is 07:00 after the extra hour).
      const date = timelineAxisOffsetToDate(adapter, axis, 480 * MINUTE);
      expect(adapter.getHours(date)).to.equal(8);
      expect(adapter.getDate(date)).to.equal(2);
    });

    it('should round-trip px↔date across a fall-back transition', () => {
      const axis = { start: dstStart, end: dstEnd, dayStartMinute: 480, dayEndMinute: 1200 };
      const date = adapter.date('2025-11-02T10:00:00', 'America/New_York');
      const offset = dateToTimelineAxisOffsetMs(adapter, axis, date);
      expect(offset).to.equal(120 * MINUTE);
      expect(timelineAxisOffsetToDate(adapter, axis, offset)).toEqualDateTime(date);
    });

    it('should round-trip px↔date across a spring-forward transition', () => {
      // Mar 8 2026: clocks spring forward at 02:00, the day lasts 23 hours.
      const springStart = adapter.date('2026-03-08T00:00:00', 'America/New_York');
      const axis = {
        start: springStart,
        end: adapter.endOfDay(adapter.addDays(springStart, 1)),
        dayStartMinute: 480,
        dayEndMinute: 1200,
      };
      const date = adapter.date('2026-03-08T10:00:00', 'America/New_York');
      const offset = dateToTimelineAxisOffsetMs(adapter, axis, date);
      expect(offset).to.equal(120 * MINUTE);
      expect(timelineAxisOffsetToDate(adapter, axis, offset)).toEqualDateTime(date);
    });
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

  describe('isRangeVisibleOnTimelineAxis', () => {
    it('should always be visible on the full-day window', () => {
      const rangeStart = adapter.date('2025-01-05T21:00:00.000Z', 'UTC');
      const rangeEnd = adapter.date('2025-01-05T23:00:00.000Z', 'UTC');
      expect(isRangeVisibleOnTimelineAxis(adapter, fullAxis, rangeStart, rangeEnd)).to.equal(true);
    });

    it('should be visible when the range overlaps the window', () => {
      const rangeStart = adapter.date('2025-01-05T19:00:00.000Z', 'UTC');
      const rangeEnd = adapter.date('2025-01-05T22:00:00.000Z', 'UTC');
      expect(isRangeVisibleOnTimelineAxis(adapter, trimmedAxis, rangeStart, rangeEnd)).to.equal(
        true,
      );
    });

    it('should be hidden when the range is fully inside the hidden hours', () => {
      const rangeStart = adapter.date('2025-01-05T21:00:00.000Z', 'UTC');
      const rangeEnd = adapter.date('2025-01-05T23:00:00.000Z', 'UTC');
      expect(isRangeVisibleOnTimelineAxis(adapter, trimmedAxis, rangeStart, rangeEnd)).to.equal(
        false,
      );
    });

    it('should be hidden when an overnight range never enters the window', () => {
      const rangeStart = adapter.date('2025-01-05T21:00:00.000Z', 'UTC');
      const rangeEnd = adapter.date('2025-01-06T07:00:00.000Z', 'UTC');
      expect(isRangeVisibleOnTimelineAxis(adapter, trimmedAxis, rangeStart, rangeEnd)).to.equal(
        false,
      );
    });

    it('should keep a sub-minute range inside the window visible', () => {
      const rangeStart = adapter.date('2025-01-05T10:00:00.000Z', 'UTC');
      const rangeEnd = adapter.date('2025-01-05T10:00:30.000Z', 'UTC');
      expect(isRangeVisibleOnTimelineAxis(adapter, trimmedAxis, rangeStart, rangeEnd)).to.equal(
        true,
      );
    });
  });
});
