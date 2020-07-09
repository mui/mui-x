import { Rows } from '../rows';
import { Columns } from '../colDef/colDef';
import { GridOptions } from '../gridOptions';
import { GridApiRef, GridRootRef } from '../api/gridApiRef';
import { PaginationProps } from '../../hooks/features/usePagination';

export interface ComponentParams {
  paginationProps: PaginationProps;
  rows: Rows;
  columns: Columns;
  options: GridOptions;
  api: GridApiRef;
  rootElement: GridRootRef;
}
