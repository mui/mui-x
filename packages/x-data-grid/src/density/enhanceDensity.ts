import type { Theme } from '@mui/material/styles';
import { formControlLabelClasses } from '@mui/material/FormControlLabel';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputAdornmentClasses } from '@mui/material/InputAdornment';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { addDefaultProps, addRootOverride } from '@mui/x-internals/densityTheme';
import { gridClasses } from '../constants/gridClasses';
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
  // Master zeroes the checkbox column's inset after the shared cell/header
  // rule; the emissions above land later still, so the zero is restated.
  addRootOverride(components, 'MuiDataGrid', { paddingInline: 0 }, 'cellCheckbox');
  addRootOverride(components, 'MuiDataGrid', { paddingInline: 0 }, 'columnHeaderCheckbox');
  // Same bar as material's regular Toolbar: the interactive box plus one xSmall
  // above and below, with the padding carrying that inset.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      minHeight: `calc(${touchTarget} + 2 * ${spacing('xSmall')})`,
      padding: spacing('xSmall'),
      gap: spacing('xxSmall'),
      '& svg': { fontSize: iconSize }, // see `glyph` below
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
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginInline: spacing('xxSmall') },
    'toolbarDivider',
  );
  addRootOverride(components, 'MuiDataGrid', { marginInline: spacing('xxSmall') }, 'toolbarLabel');

  // Columns management panel. The row checkbox+label is the grid's internal
  // FormControlLabel wrapper (no slot key of its own), so its gap nests here.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      padding: `${spacing('xxSmall')} ${spacing('small')}`,
      [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall') },
    },
    'columnsManagement',
  );
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
  addRootOverride(components, 'MuiDataGrid', searchField, 'toolbarQuickFilterControl');
  addRootOverride(
    components,
    'MuiDataGrid',
    { padding: `${spacing('small')} ${spacing('medium')}`, ...searchField },
    'columnsManagementHeader',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      padding: `${spacing('xSmall')} ${spacing('xSmall')} ${spacing('xSmall')} ${spacing('small')}`,
    },
    'columnsManagementFooter',
  );
  addRootOverride(
    components,
    'MuiDataGrid',
    { paddingBlock: spacing('xSmall') },
    'columnsManagementEmptyText',
  );

  // Headers: the same inline inset as cells, title↔icon gap, and the menu
  // button pull (master -5 cancelled the small button's padding so the glyph
  // sits at the header edge; the small box is `touchTarget - xxSmall` now).
  const menuPull = `calc((${touchTarget} - ${spacing('xxSmall')} - ${iconSize}) / -2)`;
  addRootOverride(components, 'MuiDataGrid', { paddingInline: spacing('xSmall') }, 'columnHeader');
  addRootOverride(
    components,
    'MuiDataGrid',
    { gap: spacing('xxSmall') },
    'columnHeaderTitleContainer',
  );
  addRootOverride(components, 'MuiDataGrid', { marginRight: menuPull }, 'menuIcon');
  addRootOverride(
    components,
    'MuiDataGrid',
    { [`& .${gridClasses.menuIcon}`]: { marginLeft: menuPull } },
    'columnHeader--alignRight',
  );

  // Cells with icons or inner controls.
  // The grid hardcodes `fontSize="small"` on its icons with no prop to change it;
  // material's enhancer maps that variant to `iconSize - 2px`, but the grid's
  // default glyph is the icon constant itself, so the owning slot restates it.
  const glyph = { '& svg': { fontSize: iconSize } };
  // The boolean cell class is on the icon itself.
  addRootOverride(components, 'MuiDataGrid', { fontSize: iconSize }, 'booleanCell');
  addRootOverride(
    components,
    'MuiDataGrid',
    { gridGap: spacing('xSmall'), ...glyph },
    'actionsCell',
  );
  // Edit input: master pads the input 16px against the cell's 10px, so the
  // value jumps on edit entry; both ride the cell inset here.
  addRootOverride(
    components,
    'MuiDataGrid',
    { '& input': { paddingInline: spacing('xSmall') }, ...glyph },
    'editInputCell',
  );
  // Long-text popups: inline inset = cell inset minus the 1px border; block
  // inset centres the first line on the row the way master's 15.5px did.
  const popupInset = {
    paddingInline: `calc(${spacing('xSmall')} - 1px)`,
    paddingBlock: `calc((${touchTarget} + 2 * ${spacing('xxSmall')} - 1px - 1lh) / 2)`,
  };
  addRootOverride(
    components,
    'MuiDataGrid',
    { paddingInline: spacing('xSmall') },
    'editLongTextCellValue',
  );
  addRootOverride(components, 'MuiDataGrid', popupInset, 'editLongTextCellPopperContent');
  addRootOverride(components, 'MuiDataGrid', popupInset, 'longTextCellPopperContent');

  // Filter panel. `panelContent` resolves on both the filter content wrapper
  // and the panel shell's inner slot, so the content inset nests under `panel`.
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      [`& .${gridClasses.panelContent}`]: {
        padding: `${spacing('large')} ${spacing('small')} ${spacing('medium')} ${spacing('xSmall')}`,
        gap: spacing('large'),
      },
    },
    'panel',
  );
  addRootOverride(components, 'MuiDataGrid', { padding: spacing('xSmall') }, 'panelFooter');
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      gap: spacing('small'),
      [`& .${gridClasses.filterFormDeleteIcon} svg`]: { fontSize: iconSize },
    },
    'filterForm',
  );

  // Footer: the same bar material gives TablePagination (`touchTarget + medium`).
  // The pagination's own toolbar is held 1px under the footer (the footer's
  // top border) by an internal grid rule, restated here at higher specificity.
  const footerBar = `calc(${touchTarget} + ${spacing('medium')})`;
  addRootOverride(
    components,
    'MuiDataGrid',
    {
      minHeight: footerBar,
      [`& .${tablePaginationClasses.root} .${tablePaginationClasses.toolbar}`]: {
        minHeight: `calc(${footerBar} - 1px)`,
      },
    },
    'footerContainer',
  );
  addRootOverride(components, 'MuiDataGrid', { marginInline: spacing('medium') }, 'rowCount');
  addRootOverride(
    components,
    'MuiDataGrid',
    { marginInline: spacing('medium') },
    'selectedRowCount',
  );
  return { ...theme, components };
}
