import { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';
import { DataGridProProps } from '../models/dataGridProProps';

export interface DataGridProComponentsPropsList {
  MuiDataGrid: DataGridProProps;
}

export interface DataGridProComponents<Theme = unknown> {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridProComponentsPropsList {}
  interface Components<Theme = unknown> extends DataGridProComponents<Theme> {}
}
