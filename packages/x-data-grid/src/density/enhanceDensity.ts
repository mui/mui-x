import type { Theme } from '@mui/material/styles';
import { addDefaultProps, addRootOverride } from '@mui/x-internals/densityTheme';
import { getDensityScale, getDensitySizing, gridDensityHeight } from './densityScale';

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: NonNullable<Theme['components']>;
};

/**
 * Make the Data Grid density-aware on the scale the theme already carries.
 * Apply after `@mui/material`'s `unstable_enhanceDensity`; without it the
 * theme has no scale to read. Emits the community slots and props only — the
 * Pro and Premium enhancers wrap this one and add what they own.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const scale = getDensityScale(theme);
  const components: NonNullable<Theme['components']> = { ...theme.components };
  const height = gridDensityHeight(scale);
  addDefaultProps(components, 'MuiDataGrid', { rowHeight: height, columnHeaderHeight: height });

  // Keyed spacing: `@mui/material`'s enhancer wraps `theme.spacing` so a scale
  // key resolves to its step (var ref with px fallback on a vars theme, px otherwise).
  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  addRootOverride(components, 'MuiDataGrid', { paddingInline: spacing('xSmall') }, 'cell');
  // Same bar as material's regular Toolbar: the interactive box plus one xSmall
  // above and below, with the padding carrying that inset. The grid renders its
  // icons with `fontSize="small"`, which material's enhancer maps to the small
  // glyph; the grid's default glyph is the icon constant itself, so the owning
  // slot sets it (material's Alert/Chip pattern).
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      minHeight: `calc(${touchTarget} + 2 * ${spacing('xSmall')})`,
      padding: spacing('xSmall'),
      gap: spacing('xxSmall'),
      '& svg': { fontSize: iconSize },
    },
    'toolbar',
  );
  // The quick filter trigger sizes itself `min-content`, which carried the
  // master box through the icon button's padding. Material's enhancer sizes
  // the box explicitly with no padding, so the trigger must restate it or it
  // collapses to the glyph (16px hit area, and `--trigger-width` follows).
  addRootOverride(
    components,
    'MuiDataGrid',
    { width: touchTarget, height: touchTarget },
    'toolbarQuickFilterTrigger',
  );
  return { ...theme, components };
}
