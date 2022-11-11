import { SxProps } from '@mui/system';

export interface BaseTextFieldSlotProps {
  id?: string;
  fullWidth?: boolean;
  label?: string;
  children?: React.ReactNode;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  value?: any;
  onChange?: React.ChangeEventHandler<any>;
  variant?: 'outlined' | 'standard';
  type: string;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  };
  InputLabelProps?: {
    shrink?: boolean;
  };
  select?: boolean;
  SelectProps?: {
    native?: boolean;
    displayEmpty?: boolean;
  };
  sx?: SxProps<any>;
}

/**
 * Overrideable components props dynamically passed to the component at rendering.
 */
export interface GridSlotsComponentsProps {
  baseCheckbox?: any;
  baseTextField?: BaseTextFieldSlotProps;
  baseFormControl?: any;
  baseSelect?: any;
  baseSwitch?: any;
  baseButton?: any;
  basePopper?: any;
  baseTooltip?: any;
  cell?: any;
  columnHeaderFilterIconButton?: any;
  columnMenu?: any;
  columnsPanel?: any;
  errorOverlay?: any;
  filterPanel?: any;
  footer?: any;
  header?: any;
  loadingOverlay?: any;
  noResultsOverlay?: any;
  noRowsOverlay?: any;
  pagination?: any;
  panel?: any;
  preferencesPanel?: any;
  row?: any;
  toolbar?: any;
}
