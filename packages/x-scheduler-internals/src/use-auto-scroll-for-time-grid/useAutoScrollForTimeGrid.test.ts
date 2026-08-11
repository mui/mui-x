import { canAutoScrollForDrag } from './useAutoScrollForTimeGrid';

describe('canAutoScrollForDrag', () => {
  // Dragging an event, resizing it, or dragging a standalone event should auto-scroll the grid.
  ['CalendarGridTimeEvent', 'CalendarGridTimeEventResizeHandler', 'StandaloneEvent'].forEach(
    (source) => {
      it(`should allow auto-scroll for a "${source}" drag`, () => {
        expect(canAutoScrollForDrag({ source })).to.equal(true);
      });
    },
  );

  // Day-grid drags belong to another scroll container, and a dialog drag carries no `source` at all;
  // none of them should scroll the time grid.
  ['CalendarGridDayEvent', 'CalendarGridDayEventResizeHandler'].forEach((source) => {
    it(`should not allow auto-scroll for a "${source}" drag`, () => {
      expect(canAutoScrollForDrag({ source })).to.equal(false);
    });
  });

  it('should not allow auto-scroll for a drag with no source (e.g. the dialog)', () => {
    expect(canAutoScrollForDrag({})).to.equal(false);
  });
});
