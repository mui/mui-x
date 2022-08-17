import { DataGridProps } from '../models/props/DataGridProps';

export interface DataGridComponentsPropsList {
  MuiDataGrid: DataGridProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends DataGridComponentsPropsList {}
}
