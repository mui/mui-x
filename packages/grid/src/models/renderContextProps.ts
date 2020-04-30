import { ContainerProps } from './containerProps';

export interface RenderColumnsProps {
  firstColIdx: number;
  lastColIdx: number;
  left: number;
  rightEmptyWidth: number;
}

export interface RenderRowProps {
  page: number;
  firstRowIdx: number;
  lastRowIdx: number;
}
export type RenderContextProps = ContainerProps & RenderColumnsProps & RenderRowProps;
