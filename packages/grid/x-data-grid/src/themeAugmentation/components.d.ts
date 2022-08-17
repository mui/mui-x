import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface DataGridComponents<Theme = unknown> {
  MuiDataGrid?: {
    defaultProps?: ComponentsProps['MuiDataGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDataGrid'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends DataGridComponents<Theme> {}
}
