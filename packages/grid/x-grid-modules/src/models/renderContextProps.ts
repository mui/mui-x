import { ContainerProps } from './containerProps';

export interface RenderColumnsProps {
  firstColIdx: number;
  lastColIdx: number;
  leftEmptyWidth: number;
  rightEmptyWidth: number;
}

export interface RenderRowProps {
  page: number;
  firstRowIdx: number;
  lastRowIdx: number;
}

export interface RenderPaginationProps {
  paginationCurrentPage?: number;
  paginationPageSize?: number;
}

export type RenderContextProps = ContainerProps &
  RenderColumnsProps &
  RenderRowProps &
  RenderPaginationProps;
