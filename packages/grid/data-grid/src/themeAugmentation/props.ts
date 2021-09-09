import { ComponentsOverrides, ComponentsProps } from '@material-ui/core/styles';
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

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends DataGridComponentsPropsList {}
}

declare module '@material-ui/core/styles/components' {
  interface Components extends DataGridComponents {}
}
