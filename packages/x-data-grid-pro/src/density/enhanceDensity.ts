import type { CSSInterpolation, Theme } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputBaseClasses } from '@mui/material/InputBase';
import { unstable_enhanceDensity as enhanceCommunityDensity } from '@mui/x-data-grid/density';
import type { DensityEnhancedTheme } from '@mui/x-data-grid/density';
import { DATA_GRID_PROPS_DEFAULT_VALUES, gridClasses } from '@mui/x-data-grid';
import { getDensityScale, getDensitySizing } from '@mui/x-data-grid/internals';
import { addDefaultProps, addStyleOverride } from '@mui/x-internals/densityTheme';
import type { DataGridProProps } from '../models/dataGridProProps';

// `MuiDataGrid.defaultProps` is typed by whichever tier's theme augmentation a
// program loads; the community package compiles this file too (it imports Pro
// types), where the key carries community props only. Pin the Pro props here so
// the Pro-only emission typechecks in every program.
type ProDensityComponents = NonNullable<Theme['components']> & {
  MuiDataGrid?: {
    defaultProps?: Partial<DataGridProProps>;
    styleOverrides?: { multiSelectChips?: CSSInterpolation };
  };
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
    headerFilterHeight: Math.max(
      scale.touchTarget + 2 * scale.spacing.xSmall,
      DATA_GRID_PROPS_DEFAULT_VALUES.columnHeaderHeight,
    ),
  });

  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  const components = enhanced.components as ProDensityComponents;
  const smallBox = `calc(${touchTarget} - ${spacing('xxSmall')})`;
  const spacingUnitPx = parseFloat(/([\d.]+)px/.exec(String(spacing(1)))?.[1] ?? '8');

  // Header filter row: the same block inset the row height formula carries
  // (xxSmall above and below the touch target), so the small input fits.
  // `paddingRight` stays physical, as master's, so RTL flips identically.
  // `columnHeader--filter`, `rowReorderIcon`, `multiSelectCell` and
  // `editMultiSelectCell` have class keys but no entry in the root resolver's
  // override list, so their `styleOverrides` keys are dropped; they nest under
  // the root slot instead (all four render inside the root, not in a portal).
  addStyleOverride(components, 'MuiDataGrid', 'root', {
    '--DataGrid-cellOffsetMultiplier': scale.spacing.medium / spacingUnitPx,
    [`& .${gridClasses.columnHeader}.${gridClasses['columnHeader--filter']}`]: {
      paddingBlock: spacing('xxSmall'),
      paddingRight: `calc(${spacing('xSmall')} + (${iconSize} - ${smallBox}) / 2)`,
      minHeight: 0,
      [`& .${iconButtonClasses.root}`]: {
        minWidth: 0,
        minHeight: 0,
        marginBlock: 0,
        height: `min(100%, ${smallBox})`,
        aspectRatio: 1,
      },
    },
    // The edit row carries master's `0 10px` inset; the rowspan stack inset
    // mirrors master's selector.
    [`& .${gridClasses.cell}[aria-rowspan]:not([aria-rowspan="1"]) .${gridClasses.multiSelectCell}`]:
      { paddingTop: spacing('xSmall') },
    [`& .${gridClasses.editMultiSelectCell}`]: { paddingInline: spacing('xSmall') },
  });
  addStyleOverride(components, 'MuiDataGrid', 'multiSelectChips', { gap: spacing('xxSmall') });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeaderFilterInput', {
    marginRight: spacing('xxSmall'),
    marginBottom: spacing('-xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeaderFilterOperatorLabel', {
    marginRight: spacing('xxSmall'),
  });

  // Row reorder: master zeroes the handle cell's inset after the shared cell
  // rule, restated here.
  addStyleOverride(components, 'MuiDataGrid', 'rowReorderCellContainer', { paddingInline: 0 });

  // Tree data / grouping toggles: a small icon button (`flex: 0 0 28px` in
  // master) and its gap to the label.
  const toggle = {
    flexBasis: smallBox,
    marginRight: spacing('medium'),
  };
  addStyleOverride(components, 'MuiDataGrid', 'treeDataGroupingCellToggle', toggle);
  addStyleOverride(components, 'MuiDataGrid', 'groupingCriteriaCellToggle', toggle);

  // Multi-select popover list and the edit autocomplete's inner block inset.
  addStyleOverride(components, 'MuiDataGrid', 'multiSelectCellPopperContent', {
    padding: spacing('xSmall'),
    gap: spacing('xxSmall'),
    marginLeft: `calc(10px - ${spacing('xSmall')})`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'editMultiSelectCellPopperContent', {
    [`& .${inputBaseClasses.root}.${inputBaseClasses.sizeSmall}`]: {
      paddingBlock: spacing('xxSmall'),
    },
    [`& .${autocompleteClasses.root} .${autocompleteClasses.tag}`]: { '--_height': smallBox },
    [`& .${autocompleteClasses.root} .${autocompleteClasses.inputRoot}.${inputBaseClasses.sizeSmall}`]:
      { '--_tagHeight': smallBox },
  });
  return enhanced;
}
