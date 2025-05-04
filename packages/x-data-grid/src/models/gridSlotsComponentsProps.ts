import * as React from 'react';
import type { GridToolbarProps } from '../components/toolbar/GridToolbar';
import type { ColumnHeaderFilterIconButtonProps } from '../components/columnHeaders/GridColumnHeaderFilterIconButton';
import type { GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenuProps';
import type { GridColumnsPanelProps } from '../components/panel/GridColumnsPanel';
import type { GridFilterPanelProps } from '../components/panel/filterPanel/GridFilterPanel';
import type { GridFooterContainerProps } from '../components/containers/GridFooterContainer';
import type { GridOverlayProps } from '../components/containers/GridOverlay';
import type { GridPanelProps } from '../components/panel/GridPanel';
import type { GridSkeletonCellProps } from '../components/cell/GridSkeletonCell';
import type { GridRowProps } from '../components/GridRow';
import type { GridCellProps } from '../components/cell/GridCell';
import type { GridColumnHeadersProps } from '../components/GridColumnHeaders';
import type { GridDetailPanelsProps } from '../components/GridDetailPanels';
import type { GridPinnedRowsProps } from '../components/GridPinnedRows';
import type { GridColumnsManagementProps } from '../components/columnsManagement/GridColumnsManagement';
import type { GridLoadingOverlayProps } from '../components/GridLoadingOverlay';
import type { GridRowCountProps } from '../components/GridRowCount';
import type { GridColumnHeaderSortIconProps } from '../components/columnHeaders/GridColumnHeaderSortIcon';
import type { GridBottomContainerProps } from '../components/virtualization/GridBottomContainer';
import type {
  AutocompleteProps,
  BadgeProps,
  ButtonProps,
  CheckboxProps,
  ChipProps,
  CircularProgressProps,
  DividerProps,
  IconButtonProps,
  InputProps,
  LinearProgressProps,
  MenuListProps,
  MenuItemProps,
  PaginationProps,
  PopperProps,
  SelectProps,
  SelectOptionProps,
  SkeletonProps,
  SwitchProps,
  TooltipProps,
  TextFieldProps,
  IconProps,
} from './gridBaseSlots';

type RootProps = React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
type MainProps = React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;

// Overrides for module augmentation
export interface BaseAutocompletePropsOverrides {}
export interface BaseBadgePropsOverrides {}
export interface BaseCheckboxPropsOverrides {}
export interface BaseChipPropsOverrides {}
export interface BaseCircularProgressPropsOverrides {}
export interface BaseDividerPropsOverrides {}
export interface BaseLinearProgressPropsOverrides {}
export interface BaseMenuListPropsOverrides {}
export interface BaseMenuItemPropsOverrides {}
export interface BaseTextFieldPropsOverrides {}
export interface BaseSelectPropsOverrides {}
export interface BaseSwitchPropsOverrides {}
export interface BaseButtonPropsOverrides {}
export interface BaseIconButtonPropsOverrides {}
export interface BaseTooltipPropsOverrides {}
export interface BasePaginationPropsOverrides {}
export interface BasePopperPropsOverrides {}
export interface BaseInputPropsOverrides {}
export interface BaseInputLabelPropsOverrides {}
export interface BaseSelectOptionPropsOverrides {}
export interface BaseSkeletonPropsOverrides {}
export interface BaseIconPropsOverrides {}

export interface CellPropsOverrides {}
export interface ToolbarPropsOverrides {}
export interface ColumnHeaderFilterIconButtonPropsOverrides {}
export interface ColumnHeaderSortIconPropsOverrides {}
export interface ColumnMenuPropsOverrides {}
export interface ColumnsPanelPropsOverrides {}
export interface DetailPanelsPropsOverrides {}
export interface ColumnsManagementPropsOverrides {}
export interface FilterPanelPropsOverrides {}
export interface FooterPropsOverrides {}
export interface FooterRowCountOverrides {}
export interface PaginationPropsOverrides {}
export interface LoadingOverlayPropsOverrides {}
export interface NoResultsOverlayPropsOverrides {}
export interface NoRowsOverlayPropsOverrides {}
export interface NoColumnsOverlayPropsOverrides {}
export interface PanelPropsOverrides {}
export interface PinnedRowsPropsOverrides {}
export interface SkeletonCellPropsOverrides {}
export interface RowPropsOverrides {}
export interface BottomContainerPropsOverrides {}

interface BaseSlotProps {
  baseAutocomplete: AutocompleteProps<string, true, false, true> & BaseAutocompletePropsOverrides;
  baseBadge: BadgeProps & BaseBadgePropsOverrides;
  baseCheckbox: CheckboxProps & BaseCheckboxPropsOverrides;
  baseChip: ChipProps & BaseChipPropsOverrides;
  baseCircularProgress: CircularProgressProps & BaseCircularProgressPropsOverrides;
  baseDivider: DividerProps & BaseDividerPropsOverrides;
  baseLinearProgress: LinearProgressProps & BaseLinearProgressPropsOverrides;
  baseMenuList: MenuListProps & BaseMenuListPropsOverrides;
  baseMenuItem: MenuItemProps & BaseMenuItemPropsOverrides;
  baseTextField: TextFieldProps & BaseTextFieldPropsOverrides;
  baseSwitch: SwitchProps & BaseSwitchPropsOverrides;
  baseButton: ButtonProps & BaseButtonPropsOverrides;
  baseIconButton: IconButtonProps & BaseIconButtonPropsOverrides;
  basePagination: PaginationProps & BasePaginationPropsOverrides;
  basePopper: PopperProps & BasePopperPropsOverrides;
  baseTooltip: TooltipProps & BaseTooltipPropsOverrides;
  baseInput: InputProps & BaseInputPropsOverrides;
  baseSelect: SelectProps & BaseSelectPropsOverrides;
  baseSelectOption: SelectOptionProps & BaseSelectOptionPropsOverrides;
  baseSkeleton: SkeletonProps & BaseSkeletonPropsOverrides;
}

export type GridBaseIconProps = IconProps & BaseIconPropsOverrides;

interface ElementSlotProps {
  bottomContainer: GridBottomContainerProps & BottomContainerPropsOverrides;
  cell: GridCellProps & CellPropsOverrides;
  columnHeaders: GridColumnHeadersProps;
  columnHeaderFilterIconButton: ColumnHeaderFilterIconButtonProps &
    ColumnHeaderFilterIconButtonPropsOverrides;
  columnHeaderSortIcon: GridColumnHeaderSortIconProps & ColumnHeaderSortIconPropsOverrides;
  columnMenu: GridColumnMenuProps & ColumnMenuPropsOverrides;
  columnsPanel: GridColumnsPanelProps & ColumnsPanelPropsOverrides;
  columnsManagement: GridColumnsManagementProps & ColumnsManagementPropsOverrides;
  detailPanels: GridDetailPanelsProps & DetailPanelsPropsOverrides;
  filterPanel: GridFilterPanelProps & FilterPanelPropsOverrides;
  footer: GridFooterContainerProps & FooterPropsOverrides;
  footerRowCount: GridRowCountProps & FooterRowCountOverrides;
  loadingOverlay: GridLoadingOverlayProps & LoadingOverlayPropsOverrides;
  noResultsOverlay: GridOverlayProps & NoResultsOverlayPropsOverrides;
  noRowsOverlay: GridOverlayProps & NoRowsOverlayPropsOverrides;
  noColumnsOverlay: GridOverlayProps & NoColumnsOverlayPropsOverrides;
  pagination: PaginationPropsOverrides;
  panel: GridPanelProps & PanelPropsOverrides;
  pinnedRows: GridPinnedRowsProps & PinnedRowsPropsOverrides;
  row: GridRowProps & RowPropsOverrides;
  skeletonCell: GridSkeletonCellProps & SkeletonCellPropsOverrides;
  toolbar: GridToolbarProps & ToolbarPropsOverrides;
  /**
   * Props passed to the `.main` (role="grid") element.
   */
  main: MainProps;
  /**
   * Props passed to the `.root` element.
   */
  root: RootProps;
}

export type GridSlotProps = BaseSlotProps & ElementSlotProps;

/**
 * Overridable components props dynamically passed to the component at rendering.
 */
export type GridSlotsComponentsProps = Partial<{
  [K in keyof GridSlotProps]: Partial<GridSlotProps[K]>;
}>;
