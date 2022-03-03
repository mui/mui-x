import { ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material/styles';

export interface PickerComponents {
  MuiDateRangePickerDay?: {
    defaultProps?: ComponentsProps['MuiDateRangePickerDay'];
    styleOverrides?: ComponentsOverrides['MuiDateRangePickerDay'];
    variants?: ComponentsVariants['MuiDateRangePickerDay'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends PickerComponents {}
}
