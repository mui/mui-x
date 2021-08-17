import { XGridProps } from '../XGridProps';

export interface XGridComponentProps {
  MuiDataGridPro: XGridProps;
}

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends XGridComponentProps {}
}
