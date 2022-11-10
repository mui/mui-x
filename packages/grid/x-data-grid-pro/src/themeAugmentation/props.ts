import { ComponentsOverrides, ComponentsProps, Theme } from '@mui/material/styles';
import { DataGridProProps } from '../models/dataGridProProps';

export interface DataGridProComponentsPropsList {
  MuiDataGrid: DataGridProProps;
}

export interface DataGridProComponents {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridProComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DataGridProComponents {}
}
