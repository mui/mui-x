import * as React from 'react';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { TextFieldProps } from '@mui/material/TextField';
import type { FormControlProps } from '@mui/material/FormControl';
import type { SelectProps } from '@mui/material/Select';
import type { SwitchProps } from '@mui/material/Switch';
import type { ButtonProps } from '@mui/material/Button';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { InputAdornmentProps } from '@mui/material/InputAdornment';
import type { TooltipProps } from '@mui/material/Tooltip';
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

// Overrides for module augmentation
export interface BaseCheckboxPropsOverrides {}
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

// XXX: Do these have special props?
type Size = 'small' | 'medium' | 'large';
type AnyRef<T> = React.RefObject<T> | React.RefCallback<T> | null;
type Prop<T, E extends keyof React.HTMLProps<T>> = React.HTMLProps<T>[E];

type Sx = any; // XXX: do we want more precise typings?
type Variant = 'standard' | 'outlined' | 'filled';
type Color = any; // XXX: need to figure this one out
type Icon = React.ReactElement<{
  fontSize?: Size | 'inherit'; // should inherit be in Size?
}>;

export type BaseButtonProps = {
  id?: string;
  disabled?: Prop<HTMLInputElement, 'disabled'>,
  onClick?: Prop<HTMLInputElement, 'onClick'>,
  children?: React.ReactNode;
  // MUI:
  size?: Size,
  startIcon?: Icon,
}

export type BaseCheckboxProps = {
  id?: string;
  checked?: boolean;
  name?: Prop<HTMLInputElement, 'name'>,
  className?: Prop<HTMLInputElement, 'className'>,
  style?: Prop<HTMLInputElement, 'style'>,
  disabled?: Prop<HTMLInputElement, 'disabled'>,
  tabIndex?: Prop<HTMLInputElement, 'tabIndex'>,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  onChange?: Prop<HTMLInputElement, 'onChange'>,
  onKeyDown?: Prop<HTMLInputElement, 'onKeyDown'>,
  // MUI:
  size?: Size;
  indeterminate?: boolean,
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef?: AnyRef<HTMLInputElement>;
  touchRippleRef?: AnyRef<any>; // FIXME: points to TouchRippleActions but we dont want that
}

export type BaseChipProps = {
  label?: React.ReactNode;
  className?: Prop<HTMLButtonElement, 'className'>,
  disabled?: Prop<HTMLButtonElement, 'disabled'>,
  tabIndex?: Prop<HTMLButtonElement, 'tabIndex'>,
  // MUI:
  size?: Size;
  variant?: Variant;
  onDelete?: (event: any) => void;
}

export type BaseFormControlProps = {
  className?: Prop<HTMLDivElement, 'className'>,
  children?: React.ReactNode;
  // MUI:
  fullWidth?: boolean;
  variant?: Variant;
  sx?: Sx;
}

export type BaseIconButtonProps = {
  ref?: Prop<HTMLButtonElement, 'ref'>,
  id?: string;
  role?: Prop<HTMLButtonElement, 'role'>,
  className?: Prop<HTMLInputElement, 'className'>,
  style?: Prop<HTMLInputElement, 'style'>,
  disabled?: Prop<HTMLInputElement, 'disabled'>,
  tabIndex?: Prop<HTMLInputElement, 'tabIndex'>,
  title?: Prop<HTMLInputElement, 'title'>,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>,
  children: Icon;
  // MUI:
  size?: Size,
  color?: Color;
  touchRippleRef?: AnyRef<any>; // FIXME: points to TouchRippleActions but we dont want that
}

export type BaseInputAdornmentProps = {
  // MUI:
  position: 'start'; // XXX: do we need more positions?
  children: Icon;
}

export type BaseInputLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  // MUI:
  shrink?: boolean
  variant?: Variant;
}

export type BasePopperProps = any // XXX: requires refactor

export type BaseSelectProps = {
  id?: string;
  value?: any;
  open?: boolean;
  native?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  label?: React.ReactNode;
  labelId?: string;
  disabled?: Prop<HTMLInputElement, 'disabled'>,
  onOpen?: React.KeyboardEventHandler<HTMLInputElement> | React.EventHandler<any>,
  onClose?: (event: React.KeyboardEvent, reason: 'escapeKeyDown' | 'backdropClick' | 'tabKeyDown') => void,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  inputRef?: AnyRef<HTMLInputElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export type BaseSelectOptionProps = {
  value?: any;
  children?: React.ReactNode;
  // MUI:
  native?: boolean;
};

// XXX(breaking-change): This is not used anywhere. We could remove it.
export type BaseSwitchProps = {}

export type BaseTextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> & {
  value?: any;
  defaultValue?: any;
  size?: Size;
  color?: Color;
  variant?: Variant;
  error?: boolean;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  label?: React.ReactNode;
  inputRef?: AnyRef<HTMLInputElement>;
  InputProps?: {
    startAdornment?: React.ReactNode,
    endAdornment?: React.ReactNode,
    style?: React.CSSProperties;
    disabled?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  },
  InputLabelProps?: {
    shrink?: boolean,
  }
  // XXX: ./packages/x-data-grid/src/components/panel/filterPanel/GridFilterInputMultipleSingleSelect.tsx
  // type="singleSelect"
};

interface GridBaseSlotProps {
  baseButton: BaseButtonProps & BaseButtonPropsOverrides;
  baseCheckbox: BaseCheckboxProps & BaseCheckboxPropsOverrides;
  baseChip: BaseChipProps & BaseChipPropsOverrides;
  baseFormControl: BaseFormControlProps & BaseFormControlPropsOverrides;
  baseIconButton: BaseIconButtonProps & BaseIconButtonPropsOverrides;
  baseInputAdornment: BaseInputAdornmentProps & BaseInputAdornmentPropsOverrides;
  baseInputLabel: BaseInputLabelProps & BaseInputLabelPropsOverrides;
  basePopper: PopperProps & BasePopperPropsOverrides;
  baseSelect: BaseSelectProps & BaseSelectPropsOverrides;
  baseSelectOption: BaseSelectOptionProps & BaseSelectOptionPropsOverrides;
  baseSwitch: BaseSwitchProps & BaseSwitchPropsOverrides;
  baseTextField: BaseTextFieldProps & BaseTextFieldPropsOverrides;
  baseTooltip: TooltipProps & BaseTooltipPropsOverrides;
}

export interface GridSlotProps extends GridBaseSlotProps {
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
}

/**
 * Overridable components props dynamically passed to the component at rendering.
 */
export type GridSlotsComponentsProps = Partial<{
  [K in keyof GridSlotProps]: Partial<GridSlotProps[K]>;
}>;
