import { DataGridProProps } from '../DataGridProProps';

export interface DataGridProComponentProps {
  MuiDataGridPro: DataGridProProps;
}

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends DataGridProComponentProps {}
}
