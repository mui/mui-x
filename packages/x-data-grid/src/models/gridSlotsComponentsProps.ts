import * as React from 'react';
import type { BadgeProps as MUIBadgeProps } from '@mui/material/Badge';
import type { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { CircularProgressProps as MUICircularProgressProps } from '@mui/material/CircularProgress';
import type { LinearProgressProps as MUILinearProgressProps } from '@mui/material/LinearProgress';
import type { MenuListProps } from '@mui/material/MenuList';
import type { MenuItemProps as MUIMenuItemProps } from '@mui/material/MenuItem';
import type { TextFieldProps } from '@mui/material/TextField';
import type { FormControlProps } from '@mui/material/FormControl';
import type { SelectProps } from '@mui/material/Select';
import type { SwitchProps } from '@mui/material/Switch';
import type { IconButtonProps as MUIIconButtonProps } from '@mui/material/IconButton';
import type { InputAdornmentProps } from '@mui/material/InputAdornment';
import type { TooltipProps as MUITooltipProps } from '@mui/material/Tooltip';
import type { InputLabelProps } from '@mui/material/InputLabel';
import type { PopperProps } from '@mui/material/Popper';
import type { TablePaginationProps } from '@mui/material/TablePagination';
import type { ChipProps } from '@mui/material/Chip';
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
import type {
  BadgeProps,
  ButtonProps,
  CircularProgressProps,
  DividerProps,
  IconButtonProps,
  LinearProgressProps,
  MenuItemProps,
  SkeletonProps,
  TooltipProps,
} from './gridBaseSlots';

type RootProps = React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
type MainProps = React.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;

// Overrides for module augmentation
export interface BaseBadgePropsOverrides {}
export interface BaseCheckboxPropsOverrides {}
export interface BaseCircularProgressPropsOverrides {}
export interface BaseDividerPropsOverrides {}
export interface BaseLinearProgressPropsOverrides {}
export interface BaseMenuListPropsOverrides {}
export interface BaseMenuItemPropsOverrides {}
export interface BaseTextFieldPropsOverrides {}
export interface BaseFormControlPropsOverrides {}
export interface BaseSelectPropsOverrides {}
export interface BaseSwitchPropsOverrides {}
export interface BaseButtonPropsOverrides {}
export interface BaseIconButtonPropsOverrides {}
export interface BaseInputAdornmentPropsOverrides {}
export interface BaseTooltipPropsOverrides {}
export interface BasePopperPropsOverrides {}
export interface BaseInputLabelPropsOverrides {}
export interface BaseSelectOptionPropsOverrides {}
export interface BaseSkeletonPropsOverrides {}
export interface BaseChipPropsOverrides {}

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
export interface PanelPropsOverrides {}
export interface PinnedRowsPropsOverrides {}
export interface SkeletonCellPropsOverrides {}
export interface RowPropsOverrides {}

interface BaseSlotProps {
  baseBadge: BadgeProps & BaseBadgePropsOverrides;
  baseCheckbox: CheckboxProps & BaseCheckboxPropsOverrides;
  baseCircularProgress: CircularProgressProps & BaseCircularProgressPropsOverrides;
  baseDivider: DividerProps & BaseDividerPropsOverrides;
  baseLinearProgress: LinearProgressProps & BaseLinearProgressPropsOverrides;
  baseMenuList: MenuListProps & BaseMenuListPropsOverrides;
  baseMenuItem: MenuItemProps & BaseMenuItemPropsOverrides;
  baseTextField: TextFieldProps & BaseTextFieldPropsOverrides;
  baseFormControl: FormControlProps & BaseFormControlPropsOverrides;
  baseSelect: SelectProps & BaseSelectPropsOverrides;
  baseSwitch: SwitchProps & BaseSwitchPropsOverrides;
  baseButton: ButtonProps & BaseButtonPropsOverrides;
  baseIconButton: IconButtonProps & BaseIconButtonPropsOverrides;
  basePopper: PopperProps & BasePopperPropsOverrides;
  baseTooltip: TooltipProps & BaseTooltipPropsOverrides;
  baseInputLabel: InputLabelProps & BaseInputLabelPropsOverrides;
  baseInputAdornment: InputAdornmentProps & BaseInputAdornmentPropsOverrides;
  baseSelectOption: {
    native: boolean;
    value: any;
    children?: React.ReactNode;
  } & BaseSelectOptionPropsOverrides;
  baseSkeleton: SkeletonProps & BaseSkeletonPropsOverrides;
  baseChip: ChipProps & BaseChipPropsOverrides;
}

interface MaterialSlotProps {
  baseBadge: MUIBadgeProps;
  baseButton: MUIButtonProps;
  baseIconButton: MUIIconButtonProps;
  baseLinearProgress: MUILinearProgressProps;
  baseCircularProgress: MUICircularProgressProps;
  baseMenuItem: MUIMenuItemProps;
  baseTooltip: MUITooltipProps;
}

interface ElementSlotProps {
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
  pagination: Partial<TablePaginationProps> & PaginationPropsOverrides;
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

// Merge MUI types into base types to keep slotProps working.
type Select<A, B, K> = K extends keyof A ? A[K] : K extends keyof B ? B[K] : never;
type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends 'ref'
    ? Select<A, B, 'ref'>
    : K extends keyof A & keyof B
      ? A[K] & B[K]
      : K extends keyof B
        ? B[K]
        : K extends keyof A
          ? A[K]
          : never;
};
export type GridSlotProps = Merge<BaseSlotProps, MaterialSlotProps> & ElementSlotProps;

/**
 * Overridable components props dynamically passed to the component at rendering.
 */
export type GridSlotsComponentsProps = Partial<{
  [K in keyof GridSlotProps]: Partial<GridSlotProps[K]>;
}>;
