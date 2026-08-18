import { adapter } from 'test/utils/scheduler';
import { createLinearTimeInteractionEngine } from './useLinearTimeDropTarget';

describe('createLinearTimeInteractionEngine', () => {
  const rangeStart = adapter.date('2024-01-15T08:00:00', 'default');
  const rangeEnd = adapter.date('2024-01-15T18:00:00', 'default');

  function createEngine(axis: 'horizontal' | 'vertical', constrainEventToTimeAxis: boolean) {
    return createLinearTimeInteractionEngine({
      adapter,
      axis,
      timeScale: { type: 'continuous', start: rangeStart, end: rangeEnd },
      constrainEventToTimeAxis,
    });
  }

  describe('pointer position', () => {
    const collection = { offsetWidth: 800, offsetHeight: 1_000 };
    const element = {
      getBoundingClientRect: () => ({ x: 50, y: 100 }),
    };

    it('should map the horizontal axis to the collection duration', () => {
      const engine = createEngine('horizontal', false);

      expect(
        engine.getCursorPositionInElementMs({
          pointer: { clientX: 250 },
          element,
          collection,
        }),
      ).to.equal(2.5 * 60 * 60 * 1_000);
    });

    it('should map the vertical axis to the collection duration', () => {
      const engine = createEngine('vertical', false);

      expect(
        engine.getCursorPositionInElementMs({
          pointer: { clientY: 350 },
          element,
          collection,
        }),
      ).to.equal(2.5 * 60 * 60 * 1_000);
    });

    it('should clamp the pointer position to the time axis', () => {
      const pointer = { clientX: 900 };

      expect(
        createEngine('horizontal', false).getCursorPositionInElementMs({
          pointer,
          element,
          collection,
        }),
      ).to.equal(10 * 60 * 60 * 1_000);
    });
  });

  it('should snap dates to the drag precision', () => {
    const engine = createEngine('horizontal', true);

    expect(engine.getDateAtOffset(83 * 60 * 1_000)).toEqualDateTime(
      adapter.date('2024-01-15T09:30:00', 'default'),
    );
  });

  describe('moving an event', () => {
    const start = adapter.date('2024-01-15T10:00:00', 'default');
    const end = adapter.date('2024-01-15T11:00:00', 'default');

    it('should preserve the duration and account for the initial grab position', () => {
      const engine = createEngine('horizontal', false);
      const result = engine.getMovedEventRange({
        start,
        end,
        cursorPositionInCollectionMs: 285 * 60 * 1_000,
        initialCursorPositionInEventMs: 15 * 60 * 1_000,
      });

      expect(result.start).toEqualDateTime(adapter.date('2024-01-15T12:30:00', 'default'));
      expect(result.end).toEqualDateTime(adapter.date('2024-01-15T13:30:00', 'default'));
    });

    it('should keep a moved event inside a bounded range', () => {
      const engine = createEngine('vertical', true);
      const beforeStart = engine.getMovedEventRange({
        start,
        end,
        cursorPositionInCollectionMs: 0,
        initialCursorPositionInEventMs: 30 * 60 * 1_000,
      });
      const afterEnd = engine.getMovedEventRange({
        start,
        end,
        cursorPositionInCollectionMs: 10 * 60 * 60 * 1_000,
        initialCursorPositionInEventMs: 15 * 60 * 1_000,
      });

      expect(beforeStart.start).toEqualDateTime(rangeStart);
      expect(beforeStart.end).toEqualDateTime(adapter.date('2024-01-15T09:00:00', 'default'));
      expect(afterEnd.start).toEqualDateTime(adapter.date('2024-01-15T17:00:00', 'default'));
      expect(afterEnd.end).toEqualDateTime(rangeEnd);
    });
  });

  describe('resizing an event', () => {
    const start = adapter.date('2024-01-15T10:00:00', 'default');
    const end = adapter.date('2024-01-15T11:00:00', 'default');

    it('should keep the minimum duration for both edges', () => {
      const engine = createEngine('horizontal', false);
      const resizedStart = engine.getResizedEventRange({
        start,
        end,
        side: 'start',
        cursorPositionInCollectionMs: 210 * 60 * 1_000,
        initialCursorPositionInEventMs: 0,
      });
      const resizedEnd = engine.getResizedEventRange({
        start,
        end,
        side: 'end',
        cursorPositionInCollectionMs: 60 * 60 * 1_000,
        initialCursorPositionInEventMs: 0,
      });

      expect(resizedStart.start).toEqualDateTime(adapter.date('2024-01-15T10:45:00', 'default'));
      expect(resizedEnd.end).toEqualDateTime(adapter.date('2024-01-15T10:15:00', 'default'));
    });

    it('should keep resized edges inside a bounded range', () => {
      const engine = createEngine('vertical', true);
      const resizedStart = engine.getResizedEventRange({
        start,
        end,
        side: 'start',
        cursorPositionInCollectionMs: -60 * 60 * 1_000,
        initialCursorPositionInEventMs: 0,
      });
      const resizedEnd = engine.getResizedEventRange({
        start,
        end,
        side: 'end',
        cursorPositionInCollectionMs: 10 * 60 * 60 * 1_000,
        initialCursorPositionInEventMs: 0,
      });

      expect(resizedStart.start).toEqualDateTime(rangeStart);
      expect(resizedEnd.end).toEqualDateTime(rangeEnd);
    });
  });

  describe('piecewise timeline axis', () => {
    const start = adapter.date('2024-01-15T00:00:00', 'default');
    const end = adapter.endOfDay(adapter.addDays(start, 1));
    const engine = createLinearTimeInteractionEngine({
      adapter,
      axis: 'horizontal',
      timeScale: {
        type: 'timeline-axis',
        axis: { start, end, dayStartMinute: 8 * 60, dayEndMinute: 20 * 60 },
      },
      constrainEventToTimeAxis: false,
    });

    it('should skip hidden hours when converting an offset to a date', () => {
      expect(engine.getDateAtOffset(14 * 60 * 60 * 1_000)).toEqualDateTime(
        adapter.date('2024-01-16T10:00:00', 'default'),
      );
    });

    it('should preserve the hidden remainder when moving an event', () => {
      const eventStart = adapter.date('2024-01-15T07:00:00', 'default');
      const eventEnd = adapter.date('2024-01-15T09:00:00', 'default');
      const result = engine.getMovedEventRange({
        start: eventStart,
        end: eventEnd,
        cursorPositionInCollectionMs: 12.5 * 60 * 60 * 1_000,
        initialCursorPositionInEventMs: 0.5 * 60 * 60 * 1_000,
      });

      expect(result.start).toEqualDateTime(adapter.date('2024-01-16T07:00:00', 'default'));
      expect(result.end).toEqualDateTime(adapter.date('2024-01-16T09:00:00', 'default'));
    });

    it('should use the rendered axis duration when resizing the end', () => {
      const eventStart = adapter.date('2024-01-15T10:00:00', 'default');
      const eventEnd = adapter.date('2024-01-16T10:00:00', 'default');
      const result = engine.getResizedEventRange({
        start: eventStart,
        end: eventEnd,
        side: 'end',
        cursorPositionInCollectionMs: 2 * 60 * 60 * 1_000,
        initialCursorPositionInEventMs: 0,
      });

      expect(result.end).toEqualDateTime(eventEnd);
    });
  });
});
