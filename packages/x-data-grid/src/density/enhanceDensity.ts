import type { Theme } from '@mui/material/styles';
import { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { addDefaultProps, addStyleOverride } from '@mui/x-internals/densityTheme';
import { gridClasses } from '../constants/gridClasses';
import type { GridClassKey } from '../constants/gridClasses';
import { getDensityScale, getDensitySizing, gridDensityHeight } from './densityScale';

// `MuiDataGrid` is typed by whichever tier's theme augmentation a program loads,
// and programs that compile this file without one (docs, tests) have no key.
export type GridDensityComponents = NonNullable<Theme['components']> & {
  MuiDataGrid?: { defaultProps?: object; styleOverrides?: Partial<Record<GridClassKey, unknown>> };
};

/** A theme whose `components` object the enhancer chain owns and can write into. */
export type DensityEnhancedTheme<T extends Theme> = T & {
  components: GridDensityComponents;
};

/**
 * Make the Data Grid density-aware on the scale the theme already carries.
 * Apply after `@mui/material`'s `unstable_enhanceDensity`; without it the
 * theme has no scale to read. Emits the community slots and props only — the
 * Pro and Premium enhancers wrap this one and add what they own.
 */
export function enhanceDensity<T extends Theme>(theme: T): DensityEnhancedTheme<T> {
  const scale = getDensityScale(theme);
  const components: GridDensityComponents = { ...theme.components };
  const height = gridDensityHeight(scale);
  // The checkbox column's width is a colDef number fed to the virtualizer;
  // `checkboxColDef` is spread over the built-in definition, so the width
  // rides it. Master leaves xxSmall on each side of the checkbox, the same
  // inset as the row height, so the cell is square. Its 50px `minWidth`
  // would clamp a narrower width, so both move.
  addDefaultProps(components, 'MuiDataGrid', {
    rowHeight: height,
    columnHeaderHeight: height,
    checkboxColDef: { width: height, minWidth: height },
  });

  // Keyed spacing: `@mui/material`'s enhancer wraps `theme.spacing` so a scale
  // key resolves to its step (var ref with px fallback on a vars theme, px otherwise).
  const { spacing } = theme;
  const { touchTarget, iconSize } = getDensitySizing(theme);
  addStyleOverride(components, 'MuiDataGrid', 'cell', { paddingInline: spacing('xSmall') });
  // Master zeroes the checkbox column's inset after the shared cell/header
  // rule; the emissions above land later still, so the zero is restated.
  addStyleOverride(components, 'MuiDataGrid', 'cellCheckbox', { paddingInline: 0 });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeaderCheckbox', { paddingInline: 0 });
  // Same bar as material's regular Toolbar: the interactive box plus one xSmall
  // above and below, with the padding carrying that inset.
  addStyleOverride(components, 'MuiDataGrid', 'toolbar', {
    minHeight: `calc(${touchTarget} + 2 * ${spacing('xSmall')})`,
    padding: spacing('xSmall'),
    gap: spacing('xxSmall'),
    '& svg': { fontSize: iconSize }, // see `glyph` below
  });
  // The quick filter trigger sizes itself `min-content`, which carried the
  // master box through the icon button's padding. Material's enhancer sizes
  // the box explicitly with no padding, so the trigger must restate it or it
  // collapses to the glyph (16px hit area, and `--trigger-width` follows).
  addStyleOverride(components, 'MuiDataGrid', 'toolbarQuickFilterTrigger', {
    width: touchTarget,
    height: touchTarget,
  });
  addStyleOverride(components, 'MuiDataGrid', 'toolbarDivider', {
    marginInline: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'toolbarLabel', { marginInline: spacing('xxSmall') });

  // Columns management panel. The row checkbox+label is the grid's internal
  // FormControlLabel wrapper (no slot key of its own), so its gap nests here.
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagement', {
    padding: `${spacing('xxSmall')} ${spacing('small')}`,
    [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall') },
  });
  // Search fields (columns panel header, toolbar quick filter): the clear
  // button pulls to the field edge. Material's enhancer pulls `edge="end"`
  // buttons by a quarter of the box; the grid's internal adornment rule
  // outranks that variant, so the pull is restated at the owning slot with
  // the edge class in the selector to outrank the internal rule in turn.
  const searchField = {
    '& svg': { fontSize: iconSize }, // see `glyph` below
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: `calc(${touchTarget} / -4)` },
  };
  addStyleOverride(components, 'MuiDataGrid', 'toolbarQuickFilterControl', searchField);
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementHeader', {
    padding: `${spacing('small')} ${spacing('medium')}`,
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementFooter', {
    padding: `${spacing('xSmall')} ${spacing('xSmall')} ${spacing('xSmall')} ${spacing('small')}`,
  });
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementEmptyText', {
    paddingBlock: spacing('xSmall'),
  });

  // Headers: the same inline inset as cells, title↔icon gap, and the menu
  // button pull (master -5 cancelled the small button's padding so the glyph
  // sits at the header edge; the small box is `touchTarget - xxSmall` now).
  const menuPull = `calc((${touchTarget} - ${spacing('xxSmall')} - ${iconSize}) / -2)`;
  addStyleOverride(components, 'MuiDataGrid', 'columnHeader', { paddingInline: spacing('xSmall') });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeaderTitleContainer', {
    gap: spacing('xxSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'menuIcon', { marginRight: menuPull });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeader--alignRight', {
    [`& .${gridClasses.menuIcon}`]: { marginLeft: menuPull },
  });

  // Cells with icons or inner controls.
  // The grid hardcodes `fontSize="small"` on its icons with no prop to change it;
  // material's enhancer maps that variant to `iconSize - 2px`, but the grid's
  // default glyph is the icon constant itself, so the owning slot restates it.
  const glyph = { '& svg': { fontSize: iconSize } };
  // The boolean cell class is on the icon itself.
  addStyleOverride(components, 'MuiDataGrid', 'booleanCell', { fontSize: iconSize });
  addStyleOverride(components, 'MuiDataGrid', 'actionsCell', {
    gridGap: spacing('xSmall'),
    ...glyph,
  });
  // Edit input: master pads the input 16px against the cell's 10px, so the
  // value jumps on edit entry; both ride the cell inset here.
  addStyleOverride(components, 'MuiDataGrid', 'editInputCell', {
    '& input': { paddingInline: spacing('xSmall') },
    ...glyph,
  });
  // Long-text popups: inline inset = cell inset minus the 1px border; block
  // inset centres the first line on the row the way master's 15.5px did.
  const popupInset = {
    paddingInline: `calc(${spacing('xSmall')} - 1px)`,
    paddingBlock: `calc((${touchTarget} + 2 * ${spacing('xxSmall')} - 1px - 1lh) / 2)`,
  };
  addStyleOverride(components, 'MuiDataGrid', 'editLongTextCellValue', {
    paddingInline: spacing('xSmall'),
  });
  addStyleOverride(components, 'MuiDataGrid', 'editLongTextCellPopperContent', popupInset);
  addStyleOverride(components, 'MuiDataGrid', 'longTextCellPopperContent', popupInset);

  // Filter panel. `panelContent` resolves on both the filter content wrapper
  // and the panel shell's inner slot, so the content inset nests under `panel`.
  addStyleOverride(components, 'MuiDataGrid', 'panel', {
    [`& .${gridClasses.panelContent}`]: {
      padding: `${spacing('large')} ${spacing('small')} ${spacing('medium')} ${spacing('xSmall')}`,
      gap: spacing('large'),
    },
  });
  addStyleOverride(components, 'MuiDataGrid', 'panelFooter', { padding: spacing('xSmall') });
  addStyleOverride(components, 'MuiDataGrid', 'filterForm', {
    gap: spacing('small'),
    [`& .${gridClasses.filterFormDeleteIcon} svg`]: { fontSize: iconSize },
  });

  // Footer: the same bar material gives TablePagination (`touchTarget + medium`).
  // The pagination's own toolbar is held 1px under the footer (the footer's
  // top border) by an internal grid rule, restated here at higher specificity.
  const footerBar = `calc(${touchTarget} + ${spacing('medium')})`;
  addStyleOverride(components, 'MuiDataGrid', 'footerContainer', {
    minHeight: footerBar,
    [`& .${tablePaginationClasses.root} .${tablePaginationClasses.toolbar}`]: {
      minHeight: `calc(${footerBar} - 1px)`,
    },
  });
  addStyleOverride(components, 'MuiDataGrid', 'rowCount', { marginInline: spacing('medium') });
  addStyleOverride(components, 'MuiDataGrid', 'selectedRowCount', {
    marginInline: spacing('medium'),
  });
  return { ...theme, components };
}
