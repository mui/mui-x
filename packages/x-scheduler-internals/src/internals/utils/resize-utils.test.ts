import { adapter } from 'test/utils/scheduler';
import type { SchedulerEventSide } from '../../models';
import { clampResizedEventEdge, isResizeHandlerEnabled } from './resize-utils';

describe('isResizeHandlerEnabled', () => {
  // A handle is enabled only when its own edge is inside the collection (a clipped edge can't resize).
  const cases: {
    side: SchedulerEventSide;
    isEventStartClipped: boolean;
    isEventEndClipped: boolean;
    expected: boolean;
  }[] = [
    // The start handle only cares about the start edge being clipped.
    { side: 'start', isEventStartClipped: false, isEventEndClipped: false, expected: true }, // prettier-ignore
    { side: 'start', isEventStartClipped: true, isEventEndClipped: false, expected: false }, // prettier-ignore
    // ...and ignores whether the end edge is clipped.
    { side: 'start', isEventStartClipped: false, isEventEndClipped: true, expected: true }, // prettier-ignore
    { side: 'start', isEventStartClipped: true, isEventEndClipped: true, expected: false }, // prettier-ignore
    // The end handle only cares about the end edge being clipped.
    { side: 'end', isEventStartClipped: false, isEventEndClipped: false, expected: true }, // prettier-ignore
    { side: 'end', isEventStartClipped: false, isEventEndClipped: true, expected: false }, // prettier-ignore
    // ...and ignores whether the start edge is clipped.
    { side: 'end', isEventStartClipped: true, isEventEndClipped: false, expected: true }, // prettier-ignore
    { side: 'end', isEventStartClipped: true, isEventEndClipped: true, expected: false }, // prettier-ignore
  ];

  cases.forEach(({ side, isEventStartClipped, isEventEndClipped, expected }) => {
    it(`should return ${expected} for side="${side}" (startClipped=${isEventStartClipped}, endClipped=${isEventEndClipped})`, () => {
      expect(
        isResizeHandlerEnabled({
          side,
          isEventStartClipped,
          isEventEndClipped,
        }),
      ).to.equal(expected);
    });
  });
});

describe('clampResizedEventEdge', () => {
  const start = adapter.date('2024-01-15T10:00:00', 'default');
  const end = adapter.date('2024-01-15T11:00:00', 'default');
  const precisionMinute = 15;

  describe('side: start', () => {
    it('should move the start to the cursor when it keeps the minimum duration', () => {
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

    it('should clamp the start so the event keeps at least one precision step', () => {
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
    it('should move the end to the cursor when it keeps the minimum duration', () => {
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

    it('should clamp the end so the event keeps at least one precision step', () => {
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
