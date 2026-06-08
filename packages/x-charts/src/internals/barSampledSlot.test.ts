import {
  getBarSampledSlots,
  getBarSampledSlotPosition,
  getBarSampledSlotAtCoordinate,
} from './barSampledSlot';

describe('barSampledSlot', () => {
  it('lays slots edge-to-edge across the range', () => {
    const slots = getBarSampledSlots([0, 100], 4);
    // 4 slots over 100px => 25px pitch.
    expect(slots.step).to.equal(25);
    const first = getBarSampledSlotPosition(slots, 0);
    const last = getBarSampledSlotPosition(slots, 3);
    expect(first.position).to.be.greaterThanOrEqual(0);
    expect(last.position + last.thickness).to.be.lessThanOrEqual(100);
    // Bars are slightly narrower than the pitch to leave a gap.
    expect(first.thickness).to.be.lessThan(25);
  });

  it('maps a coordinate back to the slot drawn under it', () => {
    const slots = getBarSampledSlots([0, 100], 4);
    for (let cursor = 0; cursor < 4; cursor += 1) {
      const { position, thickness } = getBarSampledSlotPosition(slots, cursor);
      const center = position + thickness / 2;
      expect(getBarSampledSlotAtCoordinate(slots, center)).to.equal(cursor);
    }
  });

  it('clamps coordinates outside the range to the edge slots', () => {
    const slots = getBarSampledSlots([0, 100], 4);
    expect(getBarSampledSlotAtCoordinate(slots, -50)).to.equal(0);
    expect(getBarSampledSlotAtCoordinate(slots, 999)).to.equal(3);
  });

  it('follows a reversed range (signed step)', () => {
    const slots = getBarSampledSlots([100, 0], 4);
    expect(slots.step).to.equal(-25);
    // Cursor 0 sits at the high-pixel end, cursor 3 at the low-pixel end.
    expect(getBarSampledSlotPosition(slots, 0).position).to.be.greaterThan(
      getBarSampledSlotPosition(slots, 3).position,
    );
    // Round-trip still holds under reversal.
    const { position, thickness } = getBarSampledSlotPosition(slots, 2);
    expect(getBarSampledSlotAtCoordinate(slots, position + thickness / 2)).to.equal(2);
  });
});
