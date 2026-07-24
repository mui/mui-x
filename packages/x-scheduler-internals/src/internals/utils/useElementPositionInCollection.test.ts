import { adapter } from 'test/utils/scheduler';
import { computeElementPositionInCollection } from './useElementPositionInCollection';
import { processDate } from '../../process-date';

describe('computeElementPositionInCollection', () => {
  const date = (value: string) => adapter.date(value, 'UTC');
  const processed = (value: string) => processDate(date(value), adapter);

  // 4-day collection: Jan 5 → Jan 8, like the `dayAndHour` timeline preset.
  const collectionStart = date('2025-01-05T00:00:00.000Z');
  const collectionEnd = adapter.endOfDay(date('2025-01-08T00:00:00.000Z'));

  describe('full-day window (default)', () => {
    it('should position an event relative to the whole collection', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T12:00:00.000Z'),
        end: processed('2025-01-05T18:00:00.000Z'),
        collectionStart,
        collectionEnd,
      });

      expect(result.position).to.equal(720 / 5760);
      expect(result.duration).to.equal(360 / 5760);
      expect(result.startingBeforeEdge).to.equal(false);
      expect(result.endingAfterEdge).to.equal(false);
    });

    it('should clamp an event overflowing the collection bounds', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-04T12:00:00.000Z'),
        end: processed('2025-01-09T12:00:00.000Z'),
        collectionStart,
        collectionEnd,
      });

      expect(result.position).to.equal(0);
      expect(result.duration).to.equal(1);
      expect(result.startingBeforeEdge).to.equal(true);
      expect(result.endingAfterEdge).to.equal(true);
    });
  });

  describe('trimmed window (dayStartMinute / dayEndMinute)', () => {
    // Window 8:00 → 20:00 (480 → 1200): 720 visible minutes per day, 2880 in total.
    const window = { dayStartMinute: 480, dayEndMinute: 1200 };

    it('should position an event fully inside the window of a later day', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-06T10:00:00.000Z'),
        end: processed('2025-01-06T12:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(840 / 2880);
      expect(result.duration).to.equal(120 / 2880);
      expect(result.startingBeforeEdge).to.equal(false);
      expect(result.endingAfterEdge).to.equal(false);
    });

    it('should clamp an event ending after the window to the day edge without bleeding into the next day', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T18:00:00.000Z'),
        end: processed('2025-01-05T22:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(600 / 2880);
      expect(result.duration).to.equal(120 / 2880);
      expect(result.endingAfterEdge).to.equal(true);
    });

    it('should clamp an event starting before the window to the day edge', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-06T06:00:00.000Z'),
        end: processed('2025-01-06T10:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(720 / 2880);
      expect(result.duration).to.equal(120 / 2880);
      expect(result.startingBeforeEdge).to.equal(true);
      expect(result.endingAfterEdge).to.equal(false);
    });

    it('should span the day seam when an event crosses the hidden overnight gap', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T18:00:00.000Z'),
        end: processed('2025-01-06T10:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(600 / 2880);
      expect(result.duration).to.equal(240 / 2880);
      expect(result.startingBeforeEdge).to.equal(false);
      expect(result.endingAfterEdge).to.equal(false);
    });

    it('should flag an event ending exactly at midnight as continuing past the day edge', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T18:00:00.000Z'),
        end: processed('2025-01-06T00:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(600 / 2880);
      expect(result.duration).to.equal(120 / 2880);
      expect(result.endingAfterEdge).to.equal(true);
    });

    it('should flag an event starting in the hidden evening hours as starting before the day edge', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T22:00:00.000Z'),
        end: processed('2025-01-06T10:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.position).to.equal(720 / 2880);
      expect(result.duration).to.equal(120 / 2880);
      expect(result.startingBeforeEdge).to.equal(true);
    });

    it('should return a zero duration for an event fully inside the hidden hours', () => {
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T21:00:00.000Z'),
        end: processed('2025-01-05T23:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.duration).to.equal(0);
    });

    it('should return a zero duration for an overnight event fully inside the hidden hours', () => {
      // Ends the next day but never enters the visible window: clamping makes both
      // indices land on the day seam, which must not trigger the midnight-wrap heuristic.
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T21:00:00.000Z'),
        end: processed('2025-01-06T07:00:00.000Z'),
        collectionStart,
        collectionEnd,
        ...window,
      });

      expect(result.duration).to.equal(0);
    });

    it('should keep the calendar single-day column behavior', () => {
      const singleDayEnd = adapter.endOfDay(collectionStart);
      const result = computeElementPositionInCollection(adapter, {
        start: processed('2025-01-05T06:00:00.000Z'),
        end: processed('2025-01-05T10:00:00.000Z'),
        collectionStart,
        collectionEnd: singleDayEnd,
        ...window,
      });

      expect(result.position).to.equal(0);
      expect(result.duration).to.equal(120 / 720);
      expect(result.startingBeforeEdge).to.equal(true);
      expect(result.endingAfterEdge).to.equal(false);
    });
  });
});
