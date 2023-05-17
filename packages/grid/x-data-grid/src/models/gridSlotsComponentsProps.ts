import * as React from 'react';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { TextFieldProps } from '@mui/material/TextField';
import type { FormControlProps } from '@mui/material/FormControl';
import type { SelectProps } from '@mui/material/Select';
import type { SwitchProps } from '@mui/material/Switch';
import type { ButtonProps } from '@mui/material/Button';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { TooltipProps } from '@mui/material/Tooltip';
import type { InputLabelProps } from '@mui/material/InputLabel';
import type { PopperProps } from '@mui/material/Popper';
import type { TablePaginationProps } from '@mui/material/TablePagination';
import type { ChipProps } from '@mui/material/Chip';
import type { MenuItemProps } from '@mui/material/MenuItem';
import type { ListItemIconProps } from '@mui/material/ListItemIcon';
import type { ListItemTextProps } from '@mui/material/ListItemText';
import type { GridToolbarProps } from '../components/toolbar/GridToolbar';
import type { ColumnHeaderFilterIconButtonProps } from '../components/columnHeaders/GridColumnHeaderFilterIconButton';
import type { GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenuProps';
import type { GridColumnsPanelProps } from '../components/panel/GridColumnsPanel';
import type { GridFilterPanelProps } from '../components/panel/filterPanel/GridFilterPanel';
import type { GridFooterContainerProps } from '../components/containers/GridFooterContainer';
import type { GridOverlayProps } from '../components/containers/GridOverlay';
import type { GridPanelProps } from '../components/panel/GridPanel';
import type { GridRowProps } from '../components/GridRow';
import type { GridCellProps } from '../components/cell/GridCell';
import type { GridMenuProps } from '../components/menu/GridMenu';

// Overrides for module augmentation
export interface BaseCheckboxPropsOverrides {}
export interface BaseTextFieldPropsOverrides {}
export interface BaseFormControlPropsOverrides {}
export interface BaseSelectPropsOverrides {}
export interface BaseSwitchPropsOverrides {}
export interface BaseButtonPropsOverrides {}
export interface BaseIconButtonPropsOverrides {}
export interface BaseTooltipPropsOverrides {}
export interface BasePopperPropsOverrides {}
export interface BaseInputLabelPropsOverrides {}
export interface BaseSelectOptionPropsOverrides {}
export interface BaseChipPropsOverrides {}
export interface BaseMenuItemOverrides {}
export interface BaseListItemIconOverrides {}
export interface BaseListItemTextOverrides {}
export interface CellPropsOverrides {}
export interface ToolbarPropsOverrides {}
export interface BaseMenuPropsOverrides {}
export interface ColumnHeaderFilterIconButtonPropsOverrides {}
export interface ColumnMenuPropsOverrides {}
export interface ColumnsPanelPropsOverrides {}
export interface FilterPanelPropsOverrides {}
export interface FooterPropsOverrides {}
export interface PaginationPropsOverrides {}
export interface LoadingOverlayPropsOverrides {}
export interface NoResultsOverlayPropsOverrides {}
export interface NoRowsOverlayPropsOverrides {}
export interface PanelPropsOverrides {}
export interface PreferencesPanelPropsOverrides {}
export interface RowPropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props & Overrides>;

/**
 * Overridable components props dynamically passed to the component at rendering.
 */
export interface GridSlotsComponentsProps {
  baseCheckbox?: SlotProps<CheckboxProps, BaseCheckboxPropsOverrides>;
  baseTextField?: SlotProps<TextFieldProps, BaseTextFieldPropsOverrides>;
  baseFormControl?: SlotProps<FormControlProps, BaseFormControlPropsOverrides>;
  baseSelect?: SlotProps<SelectProps, BaseSelectPropsOverrides>;
  baseSwitch?: SlotProps<SwitchProps, BaseSwitchPropsOverrides>;
  baseButton?: SlotProps<ButtonProps, BaseButtonPropsOverrides>;
  baseIconButton?: SlotProps<IconButtonProps, BaseIconButtonPropsOverrides>;
  basePopper?: SlotProps<PopperProps, BasePopperPropsOverrides>;
  baseTooltip?: SlotProps<TooltipProps, BaseTooltipPropsOverrides>;
  baseInputLabel?: SlotProps<InputLabelProps, BaseInputLabelPropsOverrides>;
  baseSelectOption?: SlotProps<
    { native: boolean; value: any; children?: React.ReactNode },
    BaseSelectOptionPropsOverrides
  >;
  baseChip?: SlotProps<ChipProps, BaseChipPropsOverrides>;
  baseMenu?: SlotProps<GridMenuProps, BaseMenuPropsOverrides>;
  baseMenuItem?: SlotProps<MenuItemProps, BaseMenuItemOverrides>;
  baseListItemIcon?: SlotProps<ListItemIconProps, BaseListItemIconOverrides>;
  baseListItemText?: SlotProps<ListItemTextProps, BaseListItemTextOverrides>;
  cell?: SlotProps<GridCellProps, CellPropsOverrides>;
  columnHeaderFilterIconButton?: SlotProps<
    ColumnHeaderFilterIconButtonProps,
    ColumnHeaderFilterIconButtonPropsOverrides
  >;
  columnMenu?: SlotProps<GridColumnMenuProps, ColumnMenuPropsOverrides>;
  columnsPanel?: SlotProps<GridColumnsPanelProps, ColumnsPanelPropsOverrides>;
  filterPanel?: SlotProps<GridFilterPanelProps, FilterPanelPropsOverrides>;
  footer?: SlotProps<GridFooterContainerProps, FooterPropsOverrides>;
  loadingOverlay?: SlotProps<GridOverlayProps, LoadingOverlayPropsOverrides>;
  noResultsOverlay?: SlotProps<GridOverlayProps, NoResultsOverlayPropsOverrides>;
  noRowsOverlay?: SlotProps<GridOverlayProps, NoRowsOverlayPropsOverrides>;
  pagination?: SlotProps<TablePaginationProps, PaginationPropsOverrides>;
  panel?: SlotProps<GridPanelProps, PanelPropsOverrides>;
  preferencesPanel?: SlotProps<
    React.HTMLAttributes<HTMLDivElement>,
    PreferencesPanelPropsOverrides
  >;
  row?: SlotProps<GridRowProps, RowPropsOverrides>;
  toolbar?: SlotProps<GridToolbarProps, ToolbarPropsOverrides>;
}
