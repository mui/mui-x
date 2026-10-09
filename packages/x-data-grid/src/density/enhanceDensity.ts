import type { Theme } from '@mui/material/styles';
import { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
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
  addRootOverride(components, 'MuiDataGrid', { marginInline: spacing('xSmall') }, 'toolbarDivider');
  addRootOverride(components, 'MuiDataGrid', { marginInline: spacing('xSmall') }, 'toolbarLabel');

  // Columns management panel. The row checkbox+label is the grid's internal
  // FormControlLabel wrapper (no slot key of its own), so its gap nests here.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      padding: `${spacing('xSmall')} ${spacing('medium')}`,
      [`& .${formControlLabelClasses.root}`]: { gap: spacing('xSmall') },
    },
    'columnsManagement',
  );
  // Search fields (columns panel header, toolbar quick filter): the clear
  // button pulls to the field edge. Material's enhancer pulls `edge="end"`
  // buttons by a quarter of the box; the grid's internal adornment rule
  // outranks that variant, so the pull is restated at the owning slot with
  // the edge class in the selector to outrank the internal rule in turn.
  const searchField = {
    '& svg': { fontSize: iconSize },
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: `calc(${touchTarget} / -4)` },
  };
  addRootOverride(components, 'MuiDataGrid', searchField, 'toolbarQuickFilterControl');
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `${spacing('medium')} ${spacing('large')}`, ...searchField },
    'columnsManagementHeader',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      padding: `${spacing('small')} ${spacing('small')} ${spacing('small')} ${spacing('medium')}`,
    },
    'columnsManagementFooter',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { paddingBlock: spacing('small') },
    'columnsManagementEmptyText',
  );
  return { ...theme, components };
}
