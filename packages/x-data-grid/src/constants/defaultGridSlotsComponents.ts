import * as React from 'react';
import { GridIconSlotsComponent, GridSlotsComponent } from '../models';
import {
  GridSkeletonCell,
  GridColumnsPanel,
  GridFilterPanel,
  GridFooter,
  GridLoadingOverlay,
  GridNoRowsOverlay,
  GridPagination,
  GridPanel,
  GridRow,
  GridColumnHeaderFilterIconButton,
  GridRowCount,
  GridColumnsManagement,
  GridColumnHeaderSortIcon,
} from '../components';
import { GridCell } from '../components/cell/GridCell';
import { GridColumnHeaders } from '../components/GridColumnHeaders';
import { GridColumnMenu } from '../components/menu/columnMenu/GridColumnMenu';
import { GridDetailPanels } from '../components/GridDetailPanels';
import { GridPinnedRows } from '../components/GridPinnedRows';
import { GridNoResultsOverlay } from '../components/GridNoResultsOverlay';
import { GridBaseSlots } from '../models/gridSlotsComponent';

type SlotKeys = keyof GridBaseSlots | keyof GridIconSlotsComponent;
const defaultSlotNames: Array<SlotKeys> = [
  // base slots
  'baseBadge',
  'baseCheckbox',
  'baseDivider',
  'baseMenuList',
  'baseMenuItem',
  'baseTextField',
  'baseFormControl',
  'baseSelect',
  'baseButton',
  'baseIconButton',
  'baseInputAdornment',
  'baseTooltip',
  'basePopper',
  'baseInputLabel',
  'baseSelectOption',
  'baseChip',
  // icon slots
  'booleanCellTrueIcon',
  'booleanCellFalseIcon',
  'columnMenuIcon',
  'openFilterButtonIcon',
  'filterPanelDeleteIcon',
  'columnFilteredIcon',
  'columnSelectorIcon',
  'columnUnsortedIcon',
  'columnSortedAscendingIcon',
  'columnSortedDescendingIcon',
  'columnResizeIcon',
  'densityCompactIcon',
  'densityStandardIcon',
  'densityComfortableIcon',
  'exportIcon',
  'moreActionsIcon',
  'treeDataCollapseIcon',
  'treeDataExpandIcon',
  'groupingCriteriaCollapseIcon',
  'groupingCriteriaExpandIcon',
  'detailPanelExpandIcon',
  'detailPanelCollapseIcon',
  'rowReorderIcon',
  'quickFilterIcon',
  'quickFilterClearIcon',
  'columnMenuHideIcon',
  'columnMenuSortAscendingIcon',
  'columnMenuSortDescendingIcon',
  'columnMenuFilterIcon',
  'columnMenuManageColumnsIcon',
  'columnMenuClearIcon',
  'loadIcon',
  'filterPanelAddIcon',
  'filterPanelRemoveAllIcon',
  'columnReorderIcon',
];
const warnIfMissingComponent = (componentName: string) => () => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Mui-X: Tried to render ${componentName}, but custom component is not provided.`);
  }
  return null;
};

export const generateDefaultSlots = <K extends string>(slotNames: K[]) =>
  slotNames.reduce(
    (acc, slotName) => {
      acc[slotName] = warnIfMissingComponent(slotName);
      return acc;
    },
    {} as Record<K, React.JSXElementConstructor<any>>,
  );

// TODO: camelCase these key. It's a private helper now.
// Remove then need to call `uncapitalizeObjectKeys`.
export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...generateDefaultSlots<SlotKeys>(defaultSlotNames),
  cell: GridCell,
  skeletonCell: GridSkeletonCell,
  columnHeaderFilterIconButton: GridColumnHeaderFilterIconButton,
  columnHeaderSortIcon: GridColumnHeaderSortIcon,
  columnMenu: GridColumnMenu,
  columnHeaders: GridColumnHeaders,
  detailPanels: GridDetailPanels,
  footer: GridFooter,
  footerRowCount: GridRowCount,
  toolbar: null,
  pinnedRows: GridPinnedRows,
  loadingOverlay: GridLoadingOverlay,
  noResultsOverlay: GridNoResultsOverlay,
  noRowsOverlay: GridNoRowsOverlay,
  pagination: GridPagination,
  filterPanel: GridFilterPanel,
  columnsPanel: GridColumnsPanel,
  columnsManagement: GridColumnsManagement,
  panel: GridPanel,
  row: GridRow,
};
