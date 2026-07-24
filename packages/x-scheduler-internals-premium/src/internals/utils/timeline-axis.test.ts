import { adapter } from 'test/utils/scheduler';
import {
  getTimelineAxisDurationMs,
  timelineAxisOffsetToDate,
  dateToTimelineAxisOffsetMs,
  isRangeVisibleOnTimelineAxis,
} from './timeline-axis';

const MINUTE = 60_000;

describe('timeline-axis', () => {
  const start = adapter.date('2025-01-05T00:00:00.000Z', 'UTC');
  const end = adapter.endOfDay(adapter.date('2025-01-08T00:00:00.000Z', 'UTC'));

  const fullAxis = { start, end, dayStartMinute: 0, dayEndMinute: 1440 };
  // Window 8:00 → 20:00: 720 visible minutes per day.
  const trimmedAxis = { start, end, dayStartMinute: 480, dayEndMinute: 1200 };

  describe('getTimelineAxisDurationMs', () => {
    it('should return the real duration for the full-day window', () => {
      expect(getTimelineAxisDurationMs(adapter, fullAxis)).to.equal(
        adapter.getTime(end) - adapter.getTime(start),
      );
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
      const edge = adapter.date('2025-01-05T20:00:00.000Z', 'UTC');
      expect(dateToTimelineAxisOffsetMs(adapter, trimmedAxis, hidden)).to.equal(
        dateToTimelineAxisOffsetMs(adapter, trimmedAxis, edge),
      );
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
  });
});
