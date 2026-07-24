import { adapter } from 'test/utils/scheduler';
import type { SchedulerEventSide } from '../../models';
import { clampResizedEventEdge, isResizeHandlerEnabled } from './resize-utils';

describe('isResizeHandlerEnabled', () => {
  // A handle is enabled only when its own edge is inside the collection (a clipped edge can't resize).
  const cases: {
    side: SchedulerEventSide;
    doesEventStartBeforeCollectionStart: boolean;
    doesEventEndAfterCollectionEnd: boolean;
    expected: boolean;
  }[] = [
    // The start handle only cares about the start edge being clipped.
    { side: 'start', doesEventStartBeforeCollectionStart: false, doesEventEndAfterCollectionEnd: false, expected: true }, // prettier-ignore
    { side: 'start', doesEventStartBeforeCollectionStart: true, doesEventEndAfterCollectionEnd: false, expected: false }, // prettier-ignore
    // ...and ignores whether the end edge is clipped.
    { side: 'start', doesEventStartBeforeCollectionStart: false, doesEventEndAfterCollectionEnd: true, expected: true }, // prettier-ignore
    { side: 'start', doesEventStartBeforeCollectionStart: true, doesEventEndAfterCollectionEnd: true, expected: false }, // prettier-ignore
    // The end handle only cares about the end edge being clipped.
    { side: 'end', doesEventStartBeforeCollectionStart: false, doesEventEndAfterCollectionEnd: false, expected: true }, // prettier-ignore
    { side: 'end', doesEventStartBeforeCollectionStart: false, doesEventEndAfterCollectionEnd: true, expected: false }, // prettier-ignore
    // ...and ignores whether the start edge is clipped.
    { side: 'end', doesEventStartBeforeCollectionStart: true, doesEventEndAfterCollectionEnd: false, expected: true }, // prettier-ignore
    { side: 'end', doesEventStartBeforeCollectionStart: true, doesEventEndAfterCollectionEnd: true, expected: false }, // prettier-ignore
  ];

  cases.forEach(
    ({ side, doesEventStartBeforeCollectionStart, doesEventEndAfterCollectionEnd, expected }) => {
      it(`returns ${expected} for side="${side}" (startClipped=${doesEventStartBeforeCollectionStart}, endClipped=${doesEventEndAfterCollectionEnd})`, () => {
        expect(
          isResizeHandlerEnabled({
            side,
            doesEventStartBeforeCollectionStart,
            doesEventEndAfterCollectionEnd,
          }),
        ).to.equal(expected);
      });
    },
  );
});

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
