import type { Theme } from '@mui/material/styles';
import { badgeClasses } from '@mui/material/Badge';
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
  const wcagTargetSize = '24px';
  addStyleOverride(components, 'MuiDataGrid', 'cell', {
    paddingInline: spacing('xSmall'),
    [`&.${gridClasses['cell--editing']}`]: { padding: 1 },
  });
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
  const labelGap = {
    [`& .${formControlLabelClasses.root}`]: { gap: spacing('xxSmall'), margin: 0 },
  };
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagement', {
    padding: `${spacing('xxSmall')} ${spacing('small')}`,
    ...labelGap,
  });
  const smallButtonPull = `calc((${iconSize} - ${touchTarget} + ${spacing('xxSmall')}) / 2)`;
  const searchField = {
    [`& .${inputAdornmentClasses.positionEnd} .${iconButtonClasses.sizeSmall}.${iconButtonClasses.edgeEnd}`]:
      { marginRight: smallButtonPull },
  };
  addStyleOverride(components, 'MuiDataGrid', 'toolbarQuickFilterControl', searchField);
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementHeader', {
    padding: `${spacing('small')} ${spacing('medium')}`,
    ...searchField,
  });
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementFooter', {
    padding: `${spacing('xSmall')} ${spacing('xSmall')} ${spacing('xSmall')} ${spacing('small')}`,
    ...labelGap,
  });
  addStyleOverride(components, 'MuiDataGrid', 'columnsManagementEmptyText', {
    paddingBlock: spacing('xSmall'),
  });

  addStyleOverride(components, 'MuiDataGrid', 'columnHeader', { paddingInline: spacing('xSmall') });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeaderTitleContainer', {
    gap: spacing('xxSmall'),
    [`& .${badgeClasses.badge}`]: { top: `calc((1lh - ${spacing('xxSmall')} + 1px) / 2)` },
  });
  addStyleOverride(components, 'MuiDataGrid', 'menuIcon', { marginRight: smallButtonPull });
  addStyleOverride(components, 'MuiDataGrid', 'columnHeader--alignRight', {
    [`& .${gridClasses.menuIcon}`]: { marginLeft: smallButtonPull, marginRight: 'auto' },
  });

  addStyleOverride(components, 'MuiDataGrid', 'actionsCell', { gridGap: spacing('xSmall') });
  // Edit input: master pads the input 16px against the cell's 10px, so the
  // value jumps on edit entry; both ride the cell inset here.
  addStyleOverride(components, 'MuiDataGrid', 'editInputCell', {
    '& input': { padding: `0 ${spacing('xSmall')}`, height: '100%' },
  });
  const cornerButtonTarget = {
    '&::before': {
      content: '""',
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: `max(100%, ${wcagTargetSize})`,
      height: `max(100%, ${wcagTargetSize})`,
    },
  };
  addStyleOverride(components, 'MuiDataGrid', 'longTextCell', {
    [`&.${gridClasses.longTextCell} .${gridClasses.longTextCellExpandButton}`]: {
      right: `calc(1px - ${spacing('xSmall')})`,
      ...cornerButtonTarget,
    },
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
  addStyleOverride(components, 'MuiDataGrid', 'longTextCellPopperContent', {
    ...popupInset,
    marginLeft: `calc(10px - ${spacing('xSmall')})`,
    [`& .${gridClasses.longTextCellCollapseButton}`]: cornerButtonTarget,
  });

  // Filter panel. `panelContent` resolves on both the filter content wrapper
  // and the panel shell's inner slot, so the content inset nests under `panel`.
  addStyleOverride(components, 'MuiDataGrid', 'panel', {
    [`& .${gridClasses.panelContent}`]: {
      padding: `${spacing('large')} ${spacing('small')} ${spacing('medium')} ${spacing('xSmall')}`,
      gap: spacing('large'),
    },
  });
  addStyleOverride(components, 'MuiDataGrid', 'panelFooter', { padding: spacing('xSmall') });
  addStyleOverride(components, 'MuiDataGrid', 'filterForm', { gap: spacing('small') });

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
  addStyleOverride(components, 'MuiDataGrid', 'overlay', { gap: spacing('xSmall') });
  return { ...theme, components };
}
