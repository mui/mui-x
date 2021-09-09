import { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';
import { DataGridProps } from '../DataGridProps';

export interface DataGridComponentsPropsList {
  MuiDataGrid: DataGridProps;
}

export interface DataGridComponents {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridComponentsPropsList {}
}

declare module '@mui/material/styles/components' {
  interface Components extends DataGridComponents {}
}
