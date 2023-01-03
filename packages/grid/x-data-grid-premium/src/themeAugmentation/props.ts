import { ComponentsOverrides, ComponentsProps } from '@mui/material/styles';
import { DataGridPremiumProps } from '../models/dataGridPremiumProps';

export interface DataGridPremiumComponentsPropsList {
  MuiDataGrid: DataGridPremiumProps;
}

export interface DataGridPremiumComponents<Theme = unknown> {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridPremiumComponentsPropsList {}
  interface Components<Theme = unknown> extends DataGridPremiumComponents<Theme> {}
}
