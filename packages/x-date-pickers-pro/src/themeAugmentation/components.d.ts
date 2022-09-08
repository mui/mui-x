import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickersProComponents {
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides['MuiDateRangePickerDay'];
    variants?: ComponentsVariants['MuiDateRangePickerDay'];
  };
  MuiMultiInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiMultiInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiMultiInputDateRangeField'];
    variants?: ComponentsVariants['MuiMultiInputDateRangeField'];
  };
  MuiSingleInputDateRangeField?: {
    defaultProps?: ComponentsProps['MuiSingleInputDateRangeField'];
    styleOverrides?: ComponentsOverrides['MuiSingleInputDateRangeField'];
    variants?: ComponentsVariants['MuiSingleInputDateRangeField'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends PickersProComponents {}
}
