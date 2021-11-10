import { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';
import { DataGridProProps } from '../DataGridProProps';

export interface DataGridProComponentsPropsList {
  MuiDataGrid: DataGridProProps;
}

export interface DataGridProComponents {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridProComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DataGridProComponents {}
}
