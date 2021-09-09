import { ComponentsOverrides, ComponentsProps } from '@material-ui/core/styles';
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

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends DataGridProComponentsPropsList {}
}

declare module '@material-ui/core/styles/components' {
  interface Components extends DataGridProComponents {}
}
