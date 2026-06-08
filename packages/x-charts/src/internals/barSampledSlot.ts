/**
 * Geometry of the uniform slots that downsampled bars are laid out on.
 *
 * When a bar series is sampled, the kept bars are not drawn at their original category positions but
 * on a uniform grid that fills the band axis range — one slot per kept bar, so they become fewer and
 * wider rather than thin with gaps. The same geometry is shared by the bar plot (to place the bars)
 * and by the axis highlight (to align the highlighted band with the bar under the pointer).
 */
export interface BarSampledSlots {
  range: readonly [number, number];
  count: number;
  /**
   * The signed slot pitch, measured from `range[0]`, so it follows the axis direction and stays
   * correct for reversed axes.
   */
  step: number;
  /** The bar thickness within a slot. */
  thickness: number;
}

/**
 * Builds the slot geometry for `count` sampled bars laid across the (zoom-aware) base-axis `range`.
 */
export function getBarSampledSlots(range: readonly number[], count: number): BarSampledSlots {
  const step = count > 0 ? (range[1] - range[0]) / count : 0;
  const thickness = Math.max(1, Math.abs(step) * 0.9);
  return { range: [range[0], range[1]], count, step, thickness };
}

/**
 * The pixel position (leading edge) and thickness of the slot at `cursor` along the base axis.
 */
export function getBarSampledSlotPosition(slots: BarSampledSlots, cursor: number) {
  const { range, step, thickness } = slots;
  const edgeA = range[0] + cursor * step;
  const edgeB = range[0] + (cursor + 1) * step;
  const position = Math.min(edgeA, edgeB) + (Math.abs(step) - thickness) / 2;
  return { position, thickness };
}

/**
 * The slot (cursor) whose pixel span contains `coordinate`, clamped to the valid range. Inverts
 * {@link getBarSampledSlotPosition} so a pointer coordinate maps back to the bar drawn under it.
 */
export function getBarSampledSlotAtCoordinate(slots: BarSampledSlots, coordinate: number): number {
  const { range, step, count } = slots;
  if (step === 0) {
    return 0;
  }
  const cursor = Math.floor((coordinate - range[0]) / step);
  return Math.min(count - 1, Math.max(0, cursor));
}
