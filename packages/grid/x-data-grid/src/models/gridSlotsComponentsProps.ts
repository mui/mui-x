import * as React from 'react';
import { CheckboxProps } from '@mui/material/Checkbox';
import { TextFieldProps } from '@mui/material/TextField';
import { FormControlProps } from '@mui/material/FormControl';
import { SelectProps } from '@mui/material/Select';
import { SwitchProps } from '@mui/material/Switch';
import { ButtonProps } from '@mui/material/Button';
import { IconButtonProps } from '@mui/material/IconButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { PopperProps } from '@mui/material/Popper';
import { TablePaginationProps } from '@mui/material/TablePagination';
import { GridToolbarProps } from '../components/toolbar/GridToolbar';
import { ColumnHeaderFilterIconButtonProps } from '../components/columnHeaders/GridColumnHeaderFilterIconButton';
import { GridColumnMenuProps } from '../components/menu/columnMenu/GridColumnMenuProps';
import { GridColumnsPanelProps } from '../components/panel/GridColumnsPanel';
import { GridFilterPanelProps } from '../components/panel/filterPanel/GridFilterPanel';
import { GridFooterContainerProps } from '../components/containers/GridFooterContainer';
import { GridOverlayProps } from '../components/containers/GridOverlay';
import { GridPanelProps } from '../components/panel/GridPanel';
import { GridRowProps } from '../components/GridRowProps';
import { GridCellProps } from '../components/cell/GridCellProps';

// Overrides for module augmentation
interface BaseCheckboxPropsOverrides {}
interface BaseTextFieldPropsOverrides {}
interface BaseFormControlPropsOverrides {}
interface BaseSelectPropsOverrides {}
interface BaseSwitchPropsOverrides {}
interface BaseButtonPropsOverrides {}
interface BaseIconButtonPropsOverrides {}
interface BaseTooltipPropsOverrides {}
interface BasePopperPropsOverrides {}
interface CellPropsOverrides {}
interface ToolbarPropsOverrides {}
interface ColumnHeaderFilterIconButtonPropsOverrides {}
interface ColumnMenuPropsOverrides {}
interface ColumnsPanelPropsOverrides {}
interface FilterPanelPropsOverrides {}
interface FooterPropsOverrides {}
interface PaginationPropsOverrides {}
interface LoadingOverlayPropsOverrides {}
interface NoResultsOverlayPropsOverrides {}
interface NoRowsOverlayPropsOverrides {}
interface PanelPropsOverrides {}
interface PreferencesPanelPropsOverrides {}
interface RowPropsOverrides {}

type SlotProps<Props, Overrides> = Partial<Props> & Overrides;

/**
 * Overrideable components props dynamically passed to the component at rendering.
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
