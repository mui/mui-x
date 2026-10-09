import type { Theme } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-data-grid/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid/density';
import { gridClasses } from '@mui/x-data-grid';
import { getDensityScale, getDensitySizing, gridDensityHeight } from '@mui/x-data-grid/internals';
import { addDefaultProps, addRootOverride } from '@mui/x-internals/densityTheme';
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

  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  const { components } = enhanced;
  const glyph = { '& svg': { fontSize: iconSize } };

  // Header filter row: the same block inset the row height formula carries
  // (xxSmall above and below the touch target), so the small input fits.
  // `paddingRight` stays physical, as master's, so RTL flips identically.
  // `columnHeader--filter`, `rowReorderIcon`, `multiSelectCell` and
  // `editMultiSelectCell` have class keys but no entry in the root resolver's
  // override list, so their `styleOverrides` keys are dropped; they nest under
  // the root slot instead (all four render inside the root, not in a portal).
  addRootOverride(components, 'MuiDataGrid', {
    [`& .${gridClasses['columnHeader--filter']}`]: {
      paddingBlock: spacing('xxSmall'),
      paddingRight: spacing('xSmall'),
    },
    [`& .${gridClasses.rowReorderIcon}`]: { fontSize: iconSize },
    // Chip rows (the overflow measurer reads their computed gap); the edit
    // row carries master's `0 10px` inset; the rowspan stack inset mirrors
    // master's selector.
    [`& .${gridClasses.multiSelectCell}`]: { gap: spacing('xxSmall') },
    [`& .${gridClasses.cell}[aria-rowspan]:not([aria-rowspan="1"]) .${gridClasses.multiSelectCell}`]:
      { paddingTop: spacing('xSmall') },
    [`& .${gridClasses.editMultiSelectCell}`]: {
      gap: spacing('xxSmall'),
      paddingInline: spacing('xSmall'),
    },
  });
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginRight: spacing('xSmall'), marginBottom: spacing('-xxSmall') },
    'columnHeaderFilterInput',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginRight: spacing('xSmall') },
    'columnHeaderFilterOperatorLabel',
  );

  // Row reorder: master zeroes the handle cell's inset after the shared cell
  // rule, restated here.
  addRootOverride(components, 'MuiDataGrid', { paddingInline: 0 }, 'rowReorderCellContainer');

  // Tree data / grouping toggles: a small icon button (`flex: 0 0 28px` in
  // master) and its gap to the label.
  const toggle = {
    flexBasis: `calc(${touchTarget} - ${spacing('xxSmall')})`,
    marginRight: spacing('large'),
  };
  addRootOverride(components, 'MuiDataGrid', toggle, 'treeDataGroupingCellToggle');
  addRootOverride(components, 'MuiDataGrid', toggle, 'groupingCriteriaCellToggle');

  // Multi-select popover list and the edit autocomplete's inner block inset.
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: spacing('xSmall'), gap: spacing('xxSmall') },
    'multiSelectCellPopperContent',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      [`& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}`]: {
        paddingBlock: spacing('xxSmall'),
      },
      ...glyph,
    },
    'editMultiSelectCellPopperContent',
  );
  return enhanced;
}
