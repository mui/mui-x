import { XGridProps } from './XGridProps';

export interface XGridComponentProps {
  MuiDataGrid: XGridProps;
}

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends XGridComponentProps {}
}
