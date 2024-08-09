import { GridBaseSlots, GridSlotsComponent, GridIconSlotsComponent } from '../models';
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

const placeholder = ((name: string) => () => { throw new Error(`DataGrid: base slot "${name}" is undefined.`) }) as any;

const iconSlots: GridIconSlotsComponent = {
  booleanCellTrueIcon: placeholder('booleanCellTrueIcon'),
  booleanCellFalseIcon: placeholder('booleanCellFalseIcon'),
  columnMenuIcon: placeholder('columnMenuIcon'),
  openFilterButtonIcon: placeholder('openFilterButtonIcon'),
  filterPanelDeleteIcon: placeholder('filterPanelDeleteIcon'),
  columnFilteredIcon: placeholder('columnFilteredIcon'),
  columnSelectorIcon: placeholder('columnSelectorIcon'),
  columnUnsortedIcon: placeholder('columnUnsortedIcon'),
  columnSortedAscendingIcon: placeholder('columnSortedAscendingIcon'),
  columnSortedDescendingIcon: placeholder('columnSortedDescendingIcon'),
  columnResizeIcon: placeholder('columnResizeIcon'),
  densityCompactIcon: placeholder('densityCompactIcon'),
  densityStandardIcon: placeholder('densityStandardIcon'),
  densityComfortableIcon: placeholder('densityComfortableIcon'),
  exportIcon: placeholder('exportIcon'),
  moreActionsIcon: placeholder('moreActionsIcon'),
  treeDataCollapseIcon: placeholder('treeDataCollapseIcon'),
  treeDataExpandIcon: placeholder('treeDataExpandIcon'),
  groupingCriteriaCollapseIcon: placeholder('groupingCriteriaCollapseIcon'),
  groupingCriteriaExpandIcon: placeholder('groupingCriteriaExpandIcon'),
  detailPanelExpandIcon: placeholder('detailPanelExpandIcon'),
  detailPanelCollapseIcon: placeholder('detailPanelCollapseIcon'),
  rowReorderIcon: placeholder('rowReorderIcon'),
  quickFilterIcon: placeholder('quickFilterIcon'),
  quickFilterClearIcon: placeholder('quickFilterClearIcon'),
  columnMenuHideIcon: placeholder('columnMenuHideIcon'),
  columnMenuSortAscendingIcon: placeholder('columnMenuSortAscendingIcon'),
  columnMenuSortDescendingIcon: placeholder('columnMenuSortDescendingIcon'),
  columnMenuFilterIcon: placeholder('columnMenuFilterIcon'),
  columnMenuManageColumnsIcon: placeholder('columnMenuManageColumnsIcon'),
  columnMenuClearIcon: placeholder('columnMenuClearIcon'),
  loadIcon: placeholder('loadIcon'),
  filterPanelAddIcon: placeholder('filterPanelAddIcon'),
  filterPanelRemoveAllIcon: placeholder('filterPanelRemoveAllIcon'),
  columnReorderIcon: placeholder('columnReorderIcon'),
};

const baseSlots: GridBaseSlots & GridIconSlotsComponent = {
  ...iconSlots,
  baseCheckbox: placeholder('baseCheckbox'),
  baseTextField: placeholder('baseTextField'),
  baseFormControl: placeholder('baseFormControl'),
  baseSelect: placeholder('baseSelect'),
  baseSwitch: placeholder('baseSwitch'),
  baseButton: placeholder('baseButton'),
  baseIconButton: placeholder('baseIconButton'),
  baseInputAdornment: placeholder('baseInputAdornment'),
  baseTooltip: placeholder('baseTooltip'),
  basePopper: placeholder('basePopper'),
  baseInputLabel: placeholder('baseInputLabel'),
  baseSelectOption: placeholder('baseSelectOption'),
  baseChip: placeholder('baseChip'),
};

export const DATA_GRID_DEFAULT_SLOTS_COMPONENTS: GridSlotsComponent = {
  ...baseSlots,
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
