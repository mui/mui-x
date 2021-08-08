import { DataGridProps } from './DataGridProps';

export interface DataGridComponentProps {
  MuiDataGrid: DataGridProps;
}

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends DataGridComponentProps {}
}
