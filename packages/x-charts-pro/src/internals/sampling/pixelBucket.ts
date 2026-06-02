/**
 * Pixel-bucket (spatial) downsampling for scatter series.
 *
 * Maps each point to a cell of a pixel grid and keeps a single representative per occupied cell.
 * Points that fall in the same cell render on top of each other, so they are visually redundant;
 * this caps the rendered points at roughly the number of occupied cells regardless of the input
 * size.
 *
 * @param xPixels The x position of each point in pixels.
 * @param yPixels The y position of each point in pixels.
 * @param cellSize The size of a grid cell in pixels.
 * @returns The sorted original indices to keep (one per occupied cell, in input order).
 */
export function pixelBucket(
  xPixels: readonly number[],
  yPixels: readonly number[],
  cellSize: number,
): number[] {
  const length = Math.min(xPixels.length, yPixels.length);
  const size = cellSize > 0 ? cellSize : 1;
  const seen = new Set<string>();
  const indices: number[] = [];

  for (let i = 0; i < length; i += 1) {
    const x = xPixels[i];
    const y = yPixels[i];
    if (Number.isNaN(x) || Number.isNaN(y)) {
      continue;
    }
    const key = `${Math.floor(x / size)}|${Math.floor(y / size)}`;
    if (!seen.has(key)) {
      seen.add(key);
      indices.push(i);
    }
  }

  return indices;
}
