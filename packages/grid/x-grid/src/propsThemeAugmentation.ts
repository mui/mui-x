import { XGridProps } from './XGridProps';

export interface XGridComponentProps {
  MuiXGrid: XGridProps;
}

declare module '@material-ui/core/styles' {
  interface ComponentsPropsList extends XGridComponentProps {}
}
