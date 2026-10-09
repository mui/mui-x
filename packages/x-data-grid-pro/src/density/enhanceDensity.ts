import type { Theme } from '@mui/material/styles';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-data-grid/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid/density';
import { getDensityScale, gridDensityHeight } from '@mui/x-data-grid/internals';
import { addDefaultProps } from '@mui/x-internals/densityTheme';
import type { DataGridProProps } from '../models/dataGridProProps';

// `MuiDataGrid.defaultProps` is typed by whichever tier's theme augmentation a
// program loads; the community package compiles this file too (it imports Pro
// types), where the key carries community props only. Pin the Pro props here so
// the Pro-only emission typechecks in every program.
type ProDensityComponents = NonNullable<Theme['components']> & {
  MuiDataGrid?: { defaultProps?: Partial<DataGridProProps> };
};

/**
 * Make the Data Grid Pro density-aware: the community enhancer first, then the
 * Pro-only slots and props on top. Each tier emits only what it owns.
 *
 * The community enhancer returns a fresh theme with a fresh `components`
 * object, so this tier writes into it instead of copying the theme again.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const enhanced = enhanceCommunityDensity(theme);
  const scale = getDensityScale(enhanced);
  addDefaultProps(enhanced.components as ProDensityComponents, 'MuiDataGrid', {
    headerFilterHeight: gridDensityHeight(scale),
  });
  return enhanced;
}
