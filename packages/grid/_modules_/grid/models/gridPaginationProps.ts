export interface GridPaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  rowCount: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}
