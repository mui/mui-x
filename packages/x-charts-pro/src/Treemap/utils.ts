import {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapSlice,
  treemapSliceDice,
} from '@mui/x-charts-vendor/d3-hierarchy';
import type { TreemapTilingMethod } from './treemap.types';

/** Id assigned to the synthetic root wrapping an array of root nodes. */
export const TREEMAP_ROOT_ID = '__mui-treemap-root__';

/**
 * Maps a public tiling method name to the corresponding d3-hierarchy tile function.
 */
export function getTilingMethod(method: TreemapTilingMethod = 'squarify') {
  switch (method) {
    case 'binary':
      return treemapBinary;
    case 'slice':
      return treemapSlice;
    case 'dice':
      return treemapDice;
    case 'sliceDice':
      return treemapSliceDice;
    case 'squarify':
    default:
      return treemapSquarify;
  }
}
