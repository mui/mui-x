import { adapter } from 'test/utils/scheduler';
import { clampResizedEventEdge } from './resize-utils';

describe('clampResizedEventEdge', () => {
  const start = adapter.date('2024-01-15T10:00:00', 'default');
  const end = adapter.date('2024-01-15T11:00:00', 'default');
  const precisionMinute = 15;

  describe('side: start', () => {
    it('moves the start to the cursor when it keeps the minimum duration', () => {
      const cursorDate = adapter.date('2024-01-15T10:30:00', 'default');
      const result = clampResizedEventEdge({
        adapter,
        side: 'start',
        start,
        end,
        cursorDate,
        precisionMinute,
      });
      expect(result.start).toEqualDateTime(cursorDate);
      expect(result.end).toEqualDateTime(end);
    });

    it('clamps the start so the event keeps at least one precision step', () => {
      // Stop one precision step before `end` so the event can't invert.
      const cursorDate = adapter.date('2024-01-15T11:30:00', 'default');
      const result = clampResizedEventEdge({
        adapter,
        side: 'start',
        start,
        end,
        cursorDate,
        precisionMinute,
      });
      expect(result.start).toEqualDateTime(adapter.date('2024-01-15T10:45:00', 'default'));
      expect(result.end).toEqualDateTime(end);
    });
  });

  describe('side: end', () => {
    it('moves the end to the cursor when it keeps the minimum duration', () => {
      const cursorDate = adapter.date('2024-01-15T10:45:00', 'default');
      const result = clampResizedEventEdge({
        adapter,
        side: 'end',
        start,
        end,
        cursorDate,
        precisionMinute,
      });
      expect(result.start).toEqualDateTime(start);
      expect(result.end).toEqualDateTime(cursorDate);
    });

    it('clamps the end so the event keeps at least one precision step', () => {
      // Stop one precision step after `start` so the event can't invert.
      const cursorDate = adapter.date('2024-01-15T09:30:00', 'default');
      const result = clampResizedEventEdge({
        adapter,
        side: 'end',
        start,
        end,
        cursorDate,
        precisionMinute,
      });
      expect(result.start).toEqualDateTime(start);
      expect(result.end).toEqualDateTime(adapter.date('2024-01-15T10:15:00', 'default'));
    });
  });
});
