import * as React from 'react';
import { CheckboxProps } from '@mui/material/Checkbox';
import { TextFieldProps } from '@mui/material/TextField';
import { FormControlProps } from '@mui/material/FormControl';
import { SelectProps } from '@mui/material/Select';
import { SwitchProps } from '@mui/material/Switch';
import { ButtonProps } from '@mui/material/Button';
import { IconButtonProps } from '@mui/material/IconButton';
import { TooltipProps } from '@mui/material/Tooltip';
import type { InputLabelProps } from '@mui/material/InputLabel';
import { PopperProps } from '@mui/material/Popper';
import { TablePaginationProps } from '@mui/material/TablePagination';
import { ChipProps } from '@mui/material/Chip';
import { GridToolbarProps } from '../components/toolbar/GridToolbar';
import { ColumnHeaderFilterIconButtonProps } from '../components/columnHeaders/GridColumnHeaderFilterIconButton';
import { GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenuProps';
import { GridColumnsPanelProps } from '../components/panel/GridColumnsPanel';
import { GridFilterPanelProps } from '../components/panel/filterPanel/GridFilterPanel';
import { GridFooterContainerProps } from '../components/containers/GridFooterContainer';
import { GridOverlayProps } from '../components/containers/GridOverlay';
import { GridPanelProps } from '../components/panel/GridPanel';
import type { GridRowProps } from '../components/GridRow';
import type { GridCellProps } from '../components/cell/GridCell';
import type { GridRowCountProps } from '../components';

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
export interface CellPropsOverrides {}
export interface ToolbarPropsOverrides {}
export interface ColumnHeaderFilterIconButtonPropsOverrides {}
export interface ColumnMenuPropsOverrides {}
export interface ColumnsPanelPropsOverrides {}
export interface FilterPanelPropsOverrides {}
export interface FooterPropsOverrides {}
export interface FooterRowCountOverrides {}
export interface PaginationPropsOverrides {}
export interface LoadingOverlayPropsOverrides {}
export interface NoResultsOverlayPropsOverrides {}
export interface NoRowsOverlayPropsOverrides {}
export interface PanelPropsOverrides {}
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
  cell?: SlotProps<GridCellProps, CellPropsOverrides>;
  columnHeaderFilterIconButton?: SlotProps<
    ColumnHeaderFilterIconButtonProps,
    ColumnHeaderFilterIconButtonPropsOverrides
  >;
  columnMenu?: SlotProps<GridColumnMenuProps, ColumnMenuPropsOverrides>;
  columnsPanel?: SlotProps<GridColumnsPanelProps, ColumnsPanelPropsOverrides>;
  filterPanel?: SlotProps<GridFilterPanelProps, FilterPanelPropsOverrides>;
  footer?: SlotProps<GridFooterContainerProps, FooterPropsOverrides>;
  footerRowCount?: SlotProps<GridRowCountProps, FooterRowCountOverrides>;
  loadingOverlay?: SlotProps<GridOverlayProps, LoadingOverlayPropsOverrides>;
  noResultsOverlay?: SlotProps<GridOverlayProps, NoResultsOverlayPropsOverrides>;
  noRowsOverlay?: SlotProps<GridOverlayProps, NoRowsOverlayPropsOverrides>;
  pagination?: SlotProps<TablePaginationProps, PaginationPropsOverrides>;
  panel?: SlotProps<GridPanelProps, PanelPropsOverrides>;
  row?: SlotProps<GridRowProps, RowPropsOverrides>;
  toolbar?: SlotProps<GridToolbarProps, ToolbarPropsOverrides>;
}
