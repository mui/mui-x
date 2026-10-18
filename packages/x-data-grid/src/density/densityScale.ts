import type { DensityScale } from '@mui/x-internals/densityTheme';

export { getDensityScale, getDensitySizing } from '@mui/x-internals/densityTheme';
export type { DensityScale, DensityStepKey, DensitySizing } from '@mui/x-internals/densityTheme';

/**
 * The height of a grid row-like box (row, column header, header filter row) on
 * a scale: the touch target plus one xxSmall step above and below. JS-gated in
 * the grid (it feeds the virtualizer), so it ships as `defaultProps`, not CSS.
 */
export function gridDensityHeight(scale: DensityScale): number {
  return scale.touchTarget + 2 * scale.spacing.xxSmall;
}
