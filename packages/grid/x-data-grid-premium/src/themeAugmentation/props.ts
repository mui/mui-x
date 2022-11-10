import { ComponentsOverrides, ComponentsProps, Theme } from '@mui/material/styles';
import { DataGridPremiumProps } from '../models/dataGridPremiumProps';

export interface DataGridPremiumComponentsPropsList {
  MuiDataGrid: DataGridPremiumProps;
}

export interface DataGridPremiumComponents {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridPremiumComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DataGridPremiumComponents {}
}
