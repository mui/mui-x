/**
 * Anchor of the paint-stable window content.
 *
 * The rows render inside a `windowContent` box whose `paddingTop` places them at
 * `offsetTop - anchorTop`, cancelled visually by a `translateY` of the same magnitude.
 * Retained rows keep their offsets inside the composited layer for as long as the anchor holds, so only
 * entering rows rasterize — and every anchor move costs one whole-window raster.
 *
 * The anchor is therefore held while the scroll moves and re-quantized once it settles,
 * where that raster lands with nothing moving to expose it. Two cases still force a move
 * mid-scroll:
 * - the offset dropped below the anchor (scrolling up past it), as the pad cannot go
 *   negative;
 * - the pad grew past `MAX_ANCHOR_BLOCKS` blocks. Tiles only rasterize near the visible
 *   area, so a taller box costs the compositor tile bookkeeping rather than memory
 *   proportional to its height, but it isn't free — the cap bounds a scroll that never
 *   settles.
 *
 * Re-anchoring quantizes to `ANCHOR_BLOCK` instead of landing on the offset itself:
 * a zero pad would re-anchor again on the very next upward update, and what is left of
 * the pad is the slack an upward scroll consumes before paying for another raster.
 */
export const ANCHOR_BLOCK = 40_000;

/**
 * Hard cap on the pad, counted in `ANCHOR_BLOCK`s.
 */
export const MAX_ANCHOR_BLOCKS = 5;

const MAX_ANCHOR_PAD = ANCHOR_BLOCK * MAX_ANCHOR_BLOCKS;

function quantizeAnchor(offsetTop: number) {
  return Math.floor(offsetTop / ANCHOR_BLOCK) * ANCHOR_BLOCK;
}

/**
 * The anchor to use for `offsetTop`, given the current one. Returns the current anchor
 * whenever it can still be held.
 */
export function nextAnchorTop(anchorTop: number, offsetTop: number, isSettled: boolean) {
  const padTop = offsetTop - anchorTop;
  if (isSettled || padTop < 0 || padTop > MAX_ANCHOR_PAD) {
    return quantizeAnchor(offsetTop);
  }
  return anchorTop;
}
